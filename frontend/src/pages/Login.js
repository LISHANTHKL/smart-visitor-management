import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("admin");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {

    setLoading(true);

    try {

      const response = await fetch(
        "https://smart-visitor-management.onrender.com/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
            role,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {

        localStorage.setItem(
          "user",
          JSON.stringify(data)
        );

        if (role === "admin") {

          navigate("/admin-dashboard");

        } else {

          navigate(
            "/security-dashboard"
          );
        }

      } else {

        alert(
          data.detail ||
            "Invalid Login"
        );
      }

    } catch (error) {

      console.log(error);

      alert(
        "Backend Server Error"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-6xl w-full grid grid-cols-1 md:grid-cols-2">

        {/* LEFT */}

        <div className="bg-slate-900 text-white p-14 flex flex-col justify-center">

          <h1 className="text-6xl font-extrabold leading-tight mb-8">
            Smart Visitor
            <br />
            Management
          </h1>

          <p className="text-xl text-slate-300 leading-10">

            Enterprise-grade visitor
            access management with
            QR authentication,
            security verification,
            live approvals,
            and automated tracking.

          </p>

          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-green-400"></div>
              <span>Secure QR Authentication</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              <span>Real-Time Visitor Tracking</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span>Automated Email Notifications</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full bg-pink-400"></div>
              <span>Industry-Level Security Workflow</span>
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="p-14 flex flex-col justify-center">

          <div className="text-center mb-10">

            <div className="w-20 h-20 bg-slate-900 rounded-2xl mx-auto mb-5 flex items-center justify-center text-white text-3xl font-bold">
              SV
            </div>

            <h2 className="text-5xl font-bold text-slate-800">
              Welcome Back
            </h2>

            <p className="text-slate-500 mt-3">
              Login to continue
            </p>

          </div>

          {/* ROLE */}

          <div className="flex justify-center gap-8 mb-8">

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="admin"
                checked={role === "admin"}
                onChange={(e) =>
                  setRole(e.target.value)
                }
              />
              Admin
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="security"
                checked={
                  role === "security"
                }
                onChange={(e) =>
                  setRole(e.target.value)
                }
              />
              Security
            </label>

          </div>

          {/* EMAIL */}

          <div className="mb-5">

            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border border-gray-300 p-4 rounded-xl"
            />

          </div>

          {/* PASSWORD */}

          <div className="mb-8">

            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border border-gray-300 p-4 rounded-xl"
            />

          </div>

          {/* LOGIN */}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-700 text-white py-4 rounded-xl text-lg font-bold transition"
          >

            {loading
              ? "Logging In..."
              : "Login"}

          </button>

          {/* VISITOR */}

          <button
            onClick={() =>
              navigate("/visitor-form")
            }
            className="mt-5 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-lg font-bold transition"
          >
            Visitor Appointment Form
          </button>

          <p className="text-center text-slate-400 text-sm mt-8">
            Smart Visitor Management System
            <br />
            Enterprise Security Platform
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;