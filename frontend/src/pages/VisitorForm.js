import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

function VisitorForm() {

  const navigate = useNavigate();

  // =====================================
  // STATES
  // =====================================

  const [employees, setEmployees] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({

      visitor_name: "",

      visitor_email: "",

      visitor_phone: "",

      employee_name: "",

      department: "",

      room_no: "",

      employee_email: "",

      employee_phone: "",

      purpose: "",

      visit_date: "",

      visit_time: "",

      location:
        "Smart Visitor Corporate Office",
    });

  // =====================================
  // FETCH EMPLOYEES
  // =====================================

  useEffect(() => {

    fetchEmployees();

  }, []);

  const fetchEmployees = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/employees"
      );

      const data =
        await response.json();

      setEmployees(data);

    } catch (error) {

      console.log(error);
    }
  };

  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // =====================================
  // EMPLOYEE SELECT
  // =====================================

  const handleEmployeeSelect = (
    e
  ) => {

    const employeeName =
      e.target.value;

    const employee =
      employees.find(
        (emp) =>
          emp.name === employeeName
      );

    if (!employee) return;

    setFormData({

      ...formData,

      employee_name:
        employee.name,

      department:
        employee.department,

      room_no:
        employee.room_no,

      employee_email:
        employee.email,

      employee_phone:
        employee.phone,
    });
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response = await fetch(

        "http://127.0.0.1:8000/create-visitor-request",

        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            formData
          ),
        }
      );

      const data =
        await response.json();

      if (response.ok) {

        alert(
          "Visitor Request Submitted Successfully"
        );

        setFormData({

          visitor_name: "",

          visitor_email: "",

          visitor_phone: "",

          employee_name: "",

          department: "",

          room_no: "",

          employee_email: "",

          employee_phone: "",

          purpose: "",

          visit_date: "",

          visit_time: "",

          location:
            "Smart Visitor Corporate Office",
        });

      } else {

        alert(
          data.detail ||
          "Submission Failed"
        );
      }

    } catch (error) {

      console.log(error);

      alert("Server Error");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center p-8">

      {/* MAIN CARD */}

      <div className="bg-white w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT SECTION */}

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white p-14 flex flex-col justify-center">

          <div>

            <h1 className="text-6xl font-extrabold leading-tight mb-6">

              Smart Visitor
              <br />
              Management

            </h1>

            <p className="text-xl text-slate-300 leading-9 mb-10">

              Welcome to our
              secure corporate
              visitor appointment
              portal.

              <br />
              <br />

              Schedule meetings,
              receive QR access,
              and experience a
              modern enterprise
              visitor system.

            </p>

          </div>

          {/* FEATURES */}

          <div className="space-y-5">

            <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl">

              <div className="w-4 h-4 bg-green-400 rounded-full"></div>

              <span className="text-lg">
                Secure QR Entry System
              </span>

            </div>

            <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl">

              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>

              <span className="text-lg">
                Real-Time Approval Workflow
              </span>

            </div>

            <div className="flex items-center gap-4 bg-slate-800 p-4 rounded-xl">

              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>

              <span className="text-lg">
                Automated Email Notifications
              </span>

            </div>

          </div>

          {/* VISITOR GUIDELINES */}

          <div className="bg-slate-800 p-6 rounded-2xl mt-12">

            <h3 className="text-3xl font-bold mb-5">
              Visitor Guidelines
            </h3>

            <div className="space-y-4 text-slate-300 text-lg leading-8">

              <p>
                • Office timing:
                9:00 AM to 6:00 PM
              </p>

              <p>
                • Meeting duration:
                15 Minutes
              </p>

              <p>
                • Employees cannot attend
                multiple visitors at same time
              </p>

              <p>
                • Please select available
                meeting time slots
              </p>

              <p>
                • Security verification required
              </p>

              <p>
                • QR code mandatory
                during entry
              </p>

              <p>
                • Visitors may need to wait
                if employee is in another meeting
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT SECTION */}

        <div className="p-12 overflow-y-auto max-h-screen bg-white">

          <div className="mb-10">

            <h2 className="text-5xl font-bold text-slate-800 mb-4">
              Visitor Appointment
            </h2>

            <p className="text-slate-500 text-lg">
              Fill your appointment details carefully
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >

            {/* VISITOR NAME */}

            <div>

              <label className="block mb-3 font-semibold text-slate-700 text-lg">
                Visitor Name
              </label>

              <input
                type="text"
                name="visitor_name"
                value={
                  formData.visitor_name
                }
                onChange={handleChange}
                required
                placeholder="Enter visitor name"
                className="w-full border border-slate-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-800 text-lg"
              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="block mb-3 font-semibold text-slate-700 text-lg">
                Visitor Email
              </label>

              <input
                type="email"
                name="visitor_email"
                value={
                  formData.visitor_email
                }
                onChange={handleChange}
                required
                placeholder="Enter visitor email"
                className="w-full border border-slate-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-800 text-lg"
              />

            </div>

            {/* PHONE */}

            <div>

              <label className="block mb-3 font-semibold text-slate-700 text-lg">
                Visitor Phone
              </label>

              <input
                type="text"
                name="visitor_phone"
                value={
                  formData.visitor_phone
                }
                onChange={handleChange}
                required
                placeholder="Enter visitor phone"
                className="w-full border border-slate-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-800 text-lg"
              />

            </div>

            {/* EMPLOYEE */}

            <div>

              <label className="block mb-3 font-semibold text-slate-700 text-lg">
                Select Employee
              </label>

              <select
                onChange={
                  handleEmployeeSelect
                }
                required
                className="w-full border border-slate-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-800 text-lg"
              >

                <option value="">
                  Select Employee
                </option>

                {employees.map(
                  (employee) => (

                    <option
                      key={
                        employee._id
                      }
                      value={
                        employee.name
                      }
                    >

                      {employee.name}
                      {" - "}
                      {
                        employee.department
                      }

                    </option>
                  )
                )}

              </select>

            </div>

            {/* GRID */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>

                <label className="block mb-3 font-semibold text-slate-700 text-lg">
                  Department
                </label>

                <input
                  type="text"
                  value={
                    formData.department
                  }
                  readOnly
                  className="w-full bg-slate-100 border p-4 rounded-2xl text-lg"
                />

              </div>

              <div>

                <label className="block mb-3 font-semibold text-slate-700 text-lg">
                  Room Number
                </label>

                <input
                  type="text"
                  value={
                    formData.room_no
                  }
                  readOnly
                  className="w-full bg-slate-100 border p-4 rounded-2xl text-lg"
                />

              </div>

            </div>

            {/* CONTACT */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>

                <label className="block mb-3 font-semibold text-slate-700 text-lg">
                  Employee Contact
                </label>

                <input
                  type="text"
                  value={
                    formData.employee_phone
                  }
                  readOnly
                  className="w-full bg-slate-100 border p-4 rounded-2xl text-lg"
                />

              </div>

              <div>

                <label className="block mb-3 font-semibold text-slate-700 text-lg">
                  Employee Email
                </label>

                <input
                  type="text"
                  value={
                    formData.employee_email
                  }
                  readOnly
                  className="w-full bg-slate-100 border p-4 rounded-2xl text-lg"
                />

              </div>

            </div>

            {/* PURPOSE */}

            <div>

              <label className="block mb-3 font-semibold text-slate-700 text-lg">
                Purpose of Visit
              </label>

              <textarea
                name="purpose"
                value={
                  formData.purpose
                }
                onChange={handleChange}
                required
                rows="4"
                placeholder="Enter purpose of meeting"
                className="w-full border border-slate-300 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-800 text-lg"
              ></textarea>

            </div>

            {/* DATE TIME */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>

                <label className="block mb-3 font-semibold text-slate-700 text-lg">
                  Visit Date
                </label>

                <input
                  type="date"
                  name="visit_date"
                  value={
                    formData.visit_date
                  }
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 p-4 rounded-2xl text-lg"
                />

              </div>

              <div>

                <label className="block mb-3 font-semibold text-slate-700 text-lg">
                  Visit Time
                </label>

                <input
                  type="time"
                  name="visit_time"
                  min="09:00"
                  max="18:00"
                  value={
                    formData.visit_time
                  }
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 p-4 rounded-2xl text-lg"
                />

              </div>

            </div>

            {/* LOCATION */}

            <div>

              <label className="block mb-3 font-semibold text-slate-700 text-lg">
                Office Location
              </label>

              <input
                type="text"
                value={
                  formData.location
                }
                readOnly
                className="w-full bg-slate-100 border p-4 rounded-2xl text-lg"
              />

            </div>

            {/* BUTTONS */}

            <div className="flex gap-5 pt-5">

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-700 text-white px-10 py-4 rounded-2xl text-xl font-semibold transition duration-300 shadow-lg"
              >

                {
                  loading
                    ? "Submitting..."
                    : "Submit Request"
                }

              </button>

              {/* BACK */}

              <button
                type="button"
                onClick={() =>
                  navigate("/")
                }
                className="bg-gray-300 hover:bg-gray-400 text-black px-10 py-4 rounded-2xl text-xl font-semibold transition duration-300 shadow-lg"
              >
                Back
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default VisitorForm;