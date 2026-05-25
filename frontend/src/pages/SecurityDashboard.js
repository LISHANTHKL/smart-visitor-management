import { useEffect, useRef, useState }
from "react";

import {
  Html5QrcodeScanner
} from "html5-qrcode";

import { useNavigate }
from "react-router-dom";

function SecurityDashboard() {

  const navigate = useNavigate();

  const [scanStatus,
    setScanStatus] =
    useState(
      "Waiting For QR Scan..."
    );

  const [history,
    setHistory] =
    useState([]);

  const [scannerRunning,
    setScannerRunning] =
    useState(false);

  const [darkMode,
    setDarkMode] =
    useState(false);

  const scannerRef =
    useRef(null);

  const lastScannedRef =
    useRef("");

  const scanLockRef =
    useRef(false);

  // ======================================
  // FETCH HISTORY
  // ======================================

  const fetchHistory = async () => {

    try {

      const response = await fetch(
        "https://smart-visitor-management.onrender.com/security-logs"
      );

      const data =
        await response.json();

      setHistory(data.reverse());

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchHistory();

    const interval =
      setInterval(() => {

        fetchHistory();

      }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  // ======================================
  // START SCANNER
  // ======================================

  const startScanner = () => {

    if (scannerRunning) return;

    setScannerRunning(true);

    setScanStatus(
      "Scanner Started..."
    );

    const scanner =
      new Html5QrcodeScanner(

        "reader",

        {
          fps: 10,

          qrbox: {
            width: 280,
            height: 280,
          },

          aspectRatio: 1.0,
        },

        false
      );

    scanner.render(

      async (decodedText) => {

        // BLOCK MULTIPLE

        if (
          scanLockRef.current
        ) {
          return;
        }

        // BLOCK SAME QR

        if (
          lastScannedRef.current
          === decodedText
        ) {
          return;
        }

        scanLockRef.current =
          true;

        lastScannedRef.current =
          decodedText;

        try {

          const response =
            await fetch(

              `https://smart-visitor-management.onrender.com/scan-qr/${decodedText}`,

              {
                method: "PUT",
              }
            );

          const data =
            await response.json();

          setScanStatus(
            data.message
          );

          fetchHistory();

          // AUTO STOP

          await scanner.clear();

          scannerRef.current =
            null;

          setScannerRunning(
            false
          );

          // RESET LOCK

          setTimeout(() => {

            scanLockRef.current =
              false;

            lastScannedRef.current =
              "";

          }, 5000);

        } catch (error) {

          console.log(error);

          scanLockRef.current =
            false;
        }

      },

      (error) => {
        // ignore
      }
    );

    scannerRef.current =
      scanner;
  };

  // ======================================
  // STOP SCANNER
  // ======================================

  const stopScanner =
    async () => {

      try {

        if (
          scannerRef.current
        ) {

          await scannerRef.current.clear();

          scannerRef.current =
            null;

          setScannerRunning(
            false
          );

          setScanStatus(
            "Scanner Stopped"
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

  // ======================================
  // IMAGE UPLOAD
  // ======================================

  const handleImageUpload =
    async (event) => {

      const file =
        event.target.files[0];

      if (!file) return;

      setScanStatus(
        "QR Image Uploaded"
      );
    };

  // ======================================
  // STATUS COLORS
  // ======================================

  const getStatusColor = () => {

    if (
      scanStatus.includes(
        "Checked-In"
      )
    ) {
      return "bg-green-500";
    }

    if (
      scanStatus.includes(
        "Checked-Out"
      )
    ) {
      return "bg-blue-500";
    }

    if (
      scanStatus.includes(
        "Already"
      )
    ) {
      return "bg-red-500";
    }

    return "bg-yellow-500";
  };

  // ======================================
  // DASHBOARD COUNTS
  // ======================================

  const checkedInCount =
    history.filter(
      (log) =>
        log.status ===
        "checked_in"
    ).length;

  const checkedOutCount =
    history.filter(
      (log) =>
        log.status ===
        "checked_out"
    ).length;

  return (

    <div
      className={
        darkMode
          ? "bg-slate-900 text-white min-h-screen p-8"
          : "bg-gray-100 min-h-screen p-8"
      }
    >

      {/* TOP */}

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-bold">
          Security Dashboard
        </h1>

        <div className="flex gap-4">

          <button
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
            className="bg-black text-white px-5 py-3 rounded-xl"
          >
            Toggle Dark Mode
          </button>

          <button
            onClick={() =>
              navigate("/")
            }
            className="bg-gray-500 text-white px-5 py-3 rounded-xl"
          >
            Back
          </button>

        </div>

      </div>

      {/* CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-green-500 text-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-4xl font-bold">
            {checkedInCount}
          </h2>

          <p className="text-xl mt-3">
            Checked-In
          </p>

        </div>

        <div className="bg-blue-500 text-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-4xl font-bold">
            {checkedOutCount}
          </h2>

          <p className="text-xl mt-3">
            Checked-Out
          </p>

        </div>

        <div className={`${getStatusColor()} text-white p-8 rounded-2xl shadow-xl`}>

          <h2 className="text-2xl font-bold">
            Scan Status
          </h2>

          <p className="text-lg mt-4">
            {scanStatus}
          </p>

        </div>

      </div>

      {/* QR SCANNER */}

      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10">

        <h2 className="text-4xl font-bold mb-6 text-black">
          QR Scanner
        </h2>

        <div className="flex gap-5 mb-6">

          <button
            onClick={startScanner}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-bold"
          >
            Start Scanning
          </button>

          <button
            onClick={stopScanner}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-bold"
          >
            Stop Scanning
          </button>

        </div>

        {/* READER */}

        <div className="flex justify-center">

          <div
            id="reader"
            className="w-[400px] border-4 border-slate-800 rounded-2xl overflow-hidden"
          ></div>

        </div>

      </div>

      {/* IMAGE UPLOAD */}

      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10">

        <h2 className="text-4xl font-bold mb-6 text-black">
          Upload QR Image
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={
            handleImageUpload
          }
          className="border p-4 rounded-xl text-black"
        />

      </div>

      {/* HISTORY */}

      <div className="bg-white rounded-3xl shadow-2xl p-8 overflow-auto">

        <h2 className="text-4xl font-bold mb-6 text-black">
          Scan History
        </h2>

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="p-4">
                Visitor Name
              </th>

              <th className="p-4">
                Phone
              </th>

              <th className="p-4">
                Employee
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Date
              </th>

              <th className="p-4">
                Time
              </th>

            </tr>

          </thead>

          <tbody>

            {history.map(
              (log, index) => (

                <tr
                  key={index}
                  className="border-b text-center text-black"
                >

                  <td className="p-4">
                    {log.visitor_name}
                  </td>

                  <td className="p-4">
                    {log.visitor_phone}
                  </td>

                  <td className="p-4">
                    {log.employee_name}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-4 py-2 rounded-full text-white font-semibold ${
                        log.status ===
                        "checked_in"
                          ? "bg-green-500"
                          : log.status ===
                            "checked_out"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    >

                      {log.status}

                    </span>

                  </td>

                  <td className="p-4">
                    {log.date}
                  </td>

                  <td className="p-4">
                    {log.time}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default SecurityDashboard;