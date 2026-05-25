import { useEffect, useState } from "react";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

import Sidebar from "../components/Sidebar";

import DashboardCards from "../components/DashboardCards";

import VisitorTable from "../components/VisitorTable";

import RoomAvailability from "../components/RoomAvailability";

function AdminDashboard() {

  const [visitors, setVisitors] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [darkMode, setDarkMode] =
    useState(false);

  // =========================
  // FETCH VISITORS
  // =========================

  useEffect(() => {

    fetchVisitors();

    // AUTO REFRESH
    const interval = setInterval(() => {

      fetchVisitors();

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const fetchVisitors = async () => {

    try {

      const response = await fetch(
        "https://smart-visitor-management.onrender.com/all-visitor-requests"
      );

      const data = await response.json();

      setVisitors(data);

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // APPROVE
  // =========================

  const approveVisitor = async (
    visitorId
  ) => {

    await fetch(
      `https://smart-visitor-management.onrender.com/approve-visitor/${visitorId}`,
      {
        method: "PUT",
      }
    );

    alert("Visitor Approved");

    fetchVisitors();
  };

  // =========================
  // REJECT
  // =========================

  const rejectVisitor = async (
    visitorId
  ) => {

    await fetch(
      `https://smart-visitor-management.onrender.com/reject-visitor/${visitorId}`,
      {
        method: "PUT",
      }
    );

    alert("Visitor Rejected");

    fetchVisitors();
  };

  // =========================
  // FILTER VISITORS
  // =========================

  const filteredVisitors =
    visitors.filter((visitor) => {

      return (

        visitor.visitor_name
          ?.toLowerCase()
          .includes(search.toLowerCase())

        &&

        (
          statusFilter === ""
          ||
          visitor.status === statusFilter
        )
      );
    });

  // =========================
  // EXPORT EXCEL
  // =========================

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

    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }
    );

    saveAs(
      fileData,
      "visitor_reports.xlsx"
    );
  };

  return (

    <div
      className={
        darkMode
          ? "flex bg-slate-900 text-white min-h-screen"
          : "flex bg-gray-100 min-h-screen"
      }
    >

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN */}

      <div className="p-8 w-full">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-4xl font-bold">
            Admin Dashboard
          </h1>

          {/* DARK MODE */}

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="bg-black text-white px-5 py-3 rounded"
          >
            Toggle Dark Mode
          </button>

        </div>

        {/* DASHBOARD CARDS */}

        <DashboardCards
          visitors={visitors}
        />

        {/* FILTERS */}

        <div className="flex gap-5 mb-5 flex-wrap">

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search Visitor"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border p-3 rounded w-64 text-black"
          />

          {/* STATUS */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border p-3 rounded text-black"
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

          {/* EXPORT */}

          <button
            onClick={exportExcel}
            className="bg-green-500 text-white px-5 py-3 rounded"
          >
            Export Excel
          </button>

        </div>

        {/* VISITOR TABLE */}

        <div
          className={
            darkMode
              ? "bg-slate-800 p-5 rounded-xl shadow"
              : "bg-white p-5 rounded-xl shadow"
          }
        >

          <VisitorTable
            visitors={filteredVisitors}
            approveVisitor={approveVisitor}
            rejectVisitor={rejectVisitor}
          />

        </div>

        {/* ROOM AVAILABILITY */}

        <RoomAvailability
          visitors={visitors}
          darkMode={darkMode}
        />

      </div>

    </div>
  );
}

export default AdminDashboard;