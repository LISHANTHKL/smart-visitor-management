import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function VisitorForm() {

  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(false);

  const [availabilityMessage, setAvailabilityMessage] =
    useState("");

  const [formData, setFormData] = useState({

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

    location: "Smart Visitor Corporate Office",
  });

  // FETCH EMPLOYEES

  const fetchEmployees = async () => {

    try {

      const response = await fetch(
        "https://smart-visitor-management.onrender.com/employees"
      );

      const data = await response.json();

      setEmployees(data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchEmployees();

  }, []);

  // HANDLE INPUT

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // EMPLOYEE SELECT

  const handleEmployeeSelect = (e) => {

    const employeeName = e.target.value;

    const employee = employees.find(
      (emp) => emp.name === employeeName
    );

    if (!employee) return;

    setFormData({

      ...formData,

      employee_name: employee.name,

      department: employee.department,

      room_no: employee.room_no,

      employee_email: employee.email,

      employee_phone: employee.phone,
    });
  };

  // CHECK AVAILABILITY

  const checkAvailability = useCallback(async () => {

    if (
      !formData.employee_name ||
      !formData.visit_date ||
      !formData.visit_time
    ) {
      return;
    }

    try {

      const response = await fetch(

        `https://smart-visitor-management.onrender.com/check-availability?employee_name=${formData.employee_name}&visit_date=${formData.visit_date}&visit_time=${formData.visit_time}`

      );

      const data = await response.json();

      if (data.available) {

        setAvailabilityMessage(
          "Employee Available"
        );

      } else {

        setAvailabilityMessage(
          "Employee Busy At This Time"
        );
      }

    } catch (error) {

      console.log(error);
    }

  }, [
    formData.employee_name,
    formData.visit_date,
    formData.visit_time,
  ]);

  // FIXED USEEFFECT

  useEffect(() => {

    checkAvailability();

  }, [checkAvailability]);

  // SUBMIT

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response = await fetch(

        "https://smart-visitor-management.onrender.com/create-visitor-request",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert(
          "Visitor Request Submitted Successfully"
        );

        window.location.reload();

      } else {

        alert(
          data.detail || "Submission Failed"
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

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* LEFT SIDE */}

        <div className="bg-slate-900 text-white p-12">

          <h1 className="text-6xl font-bold leading-tight mb-8">
            Smart Visitor
            <br />
            Management
          </h1>

          <p className="text-xl text-slate-300 leading-9">

            Visitor Appointment System
            with QR Security Access.

          </p>

          {/* GUIDELINES */}

          <div className="bg-slate-800 p-6 rounded-2xl mt-10">

            <h2 className="text-3xl font-bold mb-5">
              Visitor Guidelines
            </h2>

            <div className="space-y-4 text-lg">

              <p>
                • Office Timing:
                9:00 AM - 6:00 PM
              </p>

              <p>
                • Meeting Duration:
                15 Minutes
              </p>

              <p>
                • Employee Cannot Attend
                Multiple Visitors At Same Time
              </p>

              <p>
                • QR Verification Required
              </p>

              <p>
                • Visitors May Need To Wait
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="p-12">

          <h2 className="text-5xl font-bold mb-8">
            Visitor Appointment
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <input
              type="text"
              name="visitor_name"
              placeholder="Visitor Name"
              value={formData.visitor_name}
              onChange={handleChange}
              required
              className="w-full border p-4 rounded-xl"
            />

            <input
              type="email"
              name="visitor_email"
              placeholder="Visitor Email"
              value={formData.visitor_email}
              onChange={handleChange}
              required
              className="w-full border p-4 rounded-xl"
            />

            <input
              type="text"
              name="visitor_phone"
              placeholder="Visitor Phone"
              value={formData.visitor_phone}
              onChange={handleChange}
              required
              className="w-full border p-4 rounded-xl"
            />

            {/* EMPLOYEE */}

            <select
              onChange={handleEmployeeSelect}
              required
              className="w-full border p-4 rounded-xl"
            >

              <option value="">
                Select Employee
              </option>

              {employees.map((employee) => (

                <option
                  key={employee._id}
                  value={employee.name}
                >
                  {employee.name}
                </option>
              ))}

            </select>

            {/* DEPARTMENT */}

            <input
              type="text"
              value={formData.department}
              readOnly
              placeholder="Department"
              className="w-full bg-gray-100 border p-4 rounded-xl"
            />

            {/* ROOM */}

            <input
              type="text"
              value={formData.room_no}
              readOnly
              placeholder="Room Number"
              className="w-full bg-gray-100 border p-4 rounded-xl"
            />

            {/* PURPOSE */}

            <textarea
              name="purpose"
              placeholder="Purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border p-4 rounded-xl"
            ></textarea>

            {/* DATE */}

            <input
              type="date"
              name="visit_date"
              value={formData.visit_date}
              onChange={handleChange}
              required
              className="w-full border p-4 rounded-xl"
            />

            {/* TIME */}

            <input
              type="time"
              name="visit_time"
              min="09:00"
              max="18:00"
              value={formData.visit_time}
              onChange={handleChange}
              required
              className="w-full border p-4 rounded-xl"
            />

            {/* AVAILABILITY */}

            {availabilityMessage && (

              <div
                className={`p-4 rounded-xl text-white font-bold ${
                  availabilityMessage.includes(
                    "Available"
                  )
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {availabilityMessage}
              </div>
            )}

            {/* BUTTONS */}

            <div className="flex gap-5">

              <button
                type="submit"
                disabled={loading}
                className="bg-slate-900 text-white px-8 py-4 rounded-xl"
              >

                {loading
                  ? "Submitting..."
                  : "Submit Request"}

              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="bg-gray-300 px-8 py-4 rounded-xl"
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