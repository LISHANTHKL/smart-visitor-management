import { useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    localStorage.removeItem("user");

    alert("Logged Out");

    navigate("/");
  };

  // =========================
  // BACK
  // =========================

  const goBack = () => {

    navigate("/");
  };

  return (

    <div
      className="w-64 h-screen bg-slate-900 text-white p-5"
    >

      <h1
        className="text-3xl font-bold mb-10"
      >
        Smart Visitor
      </h1>

      <ul className="space-y-6">

        <li
          className="hover:text-blue-400 cursor-pointer"
        >
          Dashboard
        </li>

        <li
          className="hover:text-blue-400 cursor-pointer"
        >
          Visitors
        </li>

        <li
          className="hover:text-blue-400 cursor-pointer"
        >
          Analytics
        </li>

        {/* BACK BUTTON */}

        <li
          onClick={goBack}
          className="hover:text-yellow-400 cursor-pointer"
        >
          Back To Login
        </li>

        {/* LOGOUT */}

        <li
          onClick={logout}
          className="hover:text-red-400 cursor-pointer"
        >
          Logout
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;