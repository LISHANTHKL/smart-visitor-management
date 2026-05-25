import { useEffect, useState } from "react";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

function AdminDashboard() {

  const [visitors, setVisitors] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("");

  const [darkMode,
    setDarkMode] =
    useState(false);

  // ======================================
  // FETCH VISITORS
  // ======================================

  const fetchVisitors = async () => {

    try {

      const response = await fetch(
        "https://smart-visitor-management.onrender.com/all-visitor-requests"
      );

      const data =
        await response.json();

      setVisitors(data.reverse());

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchVisitors();

  }, []);

  // ======================================
  // APPROVE
  // ======================================

  const approveVisitor =
    async (id) => {

      try {

        await fetch(

          `https://smart-visitor-management.onrender.com/approve-visitor/${id}`,

          {
            method: "PUT",
          }
        );

        alert(
          "Visitor Approved Successfully"
        );

        fetchVisitors();

      } catch (error) {

        console.log(error);
      }
    };

  // ======================================
  // REJECT
  // ======================================

  const rejectVisitor =
    async (id) => {

      try {

        await fetch(

          `https://smart-visitor-management.onrender.com/reject-visitor/${id}`,

          {
            method: "PUT",
          }
        );

        alert(
          "Visitor Rejected Successfully"
        );

        fetchVisitors();

      } catch (error) {

        console.log(error);
      }
    };

  // ======================================
  // FILTER
  // ======================================

  const filteredVisitors =
    visitors.filter((visitor) => {

      return (

        visitor.visitor_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        &&

        (
          statusFilter === ""
          ||
          visitor.status ===
            statusFilter
        )
      );
    });

  // ======================================
  // EXPORT EXCEL
  // ======================================

  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(
        filteredVisitors
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Visitors"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const data = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }
    );

    saveAs(
      data,
      "visitor_reports.xlsx"
    );
  };

  // ======================================
  // DASHBOARD CARDS
  // ======================================

  const totalVisitors =
    visitors.length;

  const approvedVisitors =
    visitors.filter(
      (v) =>
        v.status === "approved"
    ).length;

  const rejectedVisitors =
    visitors.filter(
      (v) =>
        v.status === "rejected"
    ).length;

  const checkedInVisitors =
    visitors.filter(
      (v) =>
        v.status === "checked_in"
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
          Admin Dashboard
        </h1>

        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="bg-black text-white px-5 py-3 rounded-xl"
        >
          Toggle Dark Mode
        </button>

      </div>

      {/* CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-blue-500 text-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-4xl font-bold">
            {totalVisitors}
          </h2>

          <p className="text-xl mt-3">
            Total Visitors
          </p>

        </div>

        <div className="bg-green-500 text-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-4xl font-bold">
            {approvedVisitors}
          </h2>

          <p className="text-xl mt-3">
            Approved
          </p>

        </div>

        <div className="bg-red-500 text-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-4xl font-bold">
            {rejectedVisitors}
          </h2>

          <p className="text-xl mt-3">
            Rejected
          </p>

        </div>

        <div className="bg-yellow-500 text-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-4xl font-bold">
            {checkedInVisitors}
          </h2>

          <p className="text-xl mt-3">
            Checked-In
          </p>

        </div>

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-5 mb-8">

        <input
          type="text"
          placeholder="Search Visitor"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="border p-4 rounded-xl w-72 text-black"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
          }
          className="border p-4 rounded-xl text-black"
        >

          <option value="">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="checked_in">
            Checked-In
          </option>

          <option value="checked_out">
            Checked-Out
          </option>

          <option value="rejected">
            Rejected
          </option>

        </select>

        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-6 py-4 rounded-xl"
        >
          Export Excel
        </button>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl shadow-2xl overflow-auto">

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>

              <th className="p-5">
                Visitor
              </th>

              <th className="p-5">
                Employee
              </th>

              <th className="p-5">
                Department
              </th>

              <th className="p-5">
                Room
              </th>

              <th className="p-5">
                Date
              </th>

              <th className="p-5">
                Time
              </th>

              <th className="p-5">
                Status
              </th>

              <th className="p-5">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredVisitors.map(
              (visitor) => (

                <tr
                  key={visitor._id}
                  className="border-b text-center"
                >

                  <td className="p-5">
                    {visitor.visitor_name}
                  </td>

                  <td className="p-5">
                    {visitor.employee_name}
                  </td>

                  <td className="p-5">
                    {visitor.department}
                  </td>

                  <td className="p-5">
                    {visitor.room_no}
                  </td>

                  <td className="p-5">
                    {visitor.visit_date}
                  </td>

                  <td className="p-5">
                    {visitor.visit_time}
                  </td>

                  <td className="p-5">

                    <span
                      className={`px-4 py-2 rounded-full text-white font-semibold ${
                        visitor.status ===
                        "approved"
                          ? "bg-green-500"
                          : visitor.status ===
                            "rejected"
                          ? "bg-red-500"
                          : visitor.status ===
                            "checked_in"
                          ? "bg-yellow-500"
                          : visitor.status ===
                            "checked_out"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >

                      {visitor.status}

                    </span>

                  </td>

                  <td className="p-5 flex gap-3 justify-center">

                    <button
                      onClick={() =>
                        approveVisitor(
                          visitor._id
                        )
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        rejectVisitor(
                          visitor._id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                    >
                      Reject
                    </button>

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

export default AdminDashboard;