import { useEffect, useRef, useState } from "react";

import { Html5QrcodeScanner } from "html5-qrcode";

import Sidebar from "../components/Sidebar";

function SecurityDashboard() {

  const [scanStatus, setScanStatus] =
    useState("Waiting for QR Scan...");

  const [history, setHistory] =
    useState([]);

  const [scannerRunning, setScannerRunning] =
    useState(false);

  const scannerRef = useRef(null);

  const lastScannedRef = useRef("");

  const scanLockRef = useRef(false);

  // ====================================
  // FETCH HISTORY
  // ====================================

  const fetchHistory = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/security-logs"
      );

      const data = await response.json();

      setHistory(data.reverse());

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchHistory();

  }, []);

  // ====================================
  // START SCANNER
  // ====================================

  const startScanner = () => {

    if (scannerRunning) return;

    setScannerRunning(true);

    const scanner =
      new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        false
      );

    scanner.render(

      async (decodedText) => {

        // BLOCK MULTIPLE SCANS

        if (scanLockRef.current) return;

        // BLOCK SAME QR

        if (
          lastScannedRef.current === decodedText
        ) {
          return;
        }

        scanLockRef.current = true;

        lastScannedRef.current =
          decodedText;

        try {

          const response = await fetch(
            `http://127.0.0.1:8000/scan-qr/${decodedText}`,
            {
              method: "PUT",
            }
          );

          const data =
            await response.json();

          setScanStatus(data.message);

          fetchHistory();

          // AUTO STOP

          await scanner.clear();

          scannerRef.current = null;

          setScannerRunning(false);

          // RESET AFTER 5 SECONDS

          setTimeout(() => {

            lastScannedRef.current = "";

            scanLockRef.current = false;

          }, 5000);

        } catch (error) {

          console.log(error);

          scanLockRef.current = false;
        }

      },

      (error) => {
        // ignore
      }
    );

    scannerRef.current = scanner;
  };

  // ====================================
  // STOP SCANNER
  // ====================================

  const stopScanner = async () => {

    try {

      if (scannerRef.current) {

        await scannerRef.current.clear();

        scannerRef.current = null;

        setScannerRunning(false);
      }

    } catch (error) {

      console.log(error);
    }
  };

  // ====================================
  // IMAGE UPLOAD
  // ====================================

  const handleImageUpload = (
    event
  ) => {

    const file =
      event.target.files[0];

    if (!file) return;

    setScanStatus(
      "QR Image Uploaded"
    );
  };

  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="p-8 w-full">

        <h1 className="text-5xl font-bold mb-8">
          Security Dashboard
        </h1>

        {/* STATUS */}

        <div
          className={`p-5 rounded-xl text-white text-2xl font-bold mb-8 ${
            scanStatus.includes("Checked-In")
              ? "bg-green-500"
              : scanStatus.includes("Checked-Out")
              ? "bg-blue-500"
              : scanStatus.includes("Already")
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {scanStatus}
        </div>

        {/* QR SCANNER */}

        <div className="bg-white p-8 rounded-2xl shadow mb-8">

          <h2 className="text-4xl font-bold mb-5">
            QR Scanner
          </h2>

          <div className="flex gap-5 mb-5">

            <button
              onClick={startScanner}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold"
            >
              Start Scanning
            </button>

            <button
              onClick={stopScanner}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold"
            >
              Stop Scanning
            </button>

          </div>

          <div className="flex justify-center">

            <div
              id="reader"
              className="w-[400px]"
            ></div>

          </div>

        </div>

        {/* IMAGE */}

        <div className="bg-white p-8 rounded-2xl shadow mb-8">

          <h2 className="text-4xl font-bold mb-5">
            Upload QR Image
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-3 rounded"
          />

        </div>

        {/* HISTORY */}

        <div className="bg-white p-8 rounded-2xl shadow">

          <h2 className="text-4xl font-bold mb-5">
            Scan History
          </h2>

          <div className="overflow-auto max-h-[500px]">

            <table className="w-full border">

              <thead className="bg-slate-800 text-white sticky top-0">

                <tr>

                  <th className="p-3">
                    Visitor Name
                  </th>

                  <th className="p-3">
                    Phone
                  </th>

                  <th className="p-3">
                    Employee
                  </th>

                  <th className="p-3">
                    Status
                  </th>

                  <th className="p-3">
                    Date
                  </th>

                  <th className="p-3">
                    Time
                  </th>

                </tr>

              </thead>

              <tbody>

                {history.map((log, index) => (

                  <tr
                    key={index}
                    className="border-b text-center"
                  >

                    <td className="p-3">
                      {log.visitor_name}
                    </td>

                    <td className="p-3">
                      {log.visitor_phone}
                    </td>

                    <td className="p-3">
                      {log.employee_name}
                    </td>

                    <td className="p-3">
                      {log.status}
                    </td>

                    <td className="p-3">
                      {log.date}
                    </td>

                    <td className="p-3">
                      {log.time}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SecurityDashboard;