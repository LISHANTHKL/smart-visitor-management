import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("admin");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async () => {

    if (!email || !password) {

      alert(
        "Please Fill All Fields"
      );

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(

        "http://127.0.0.1:8000/login",

        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {

        // ADMIN

        if (
          role === "admin"
        ) {

          navigate(
            "/admin-dashboard"
          );
        }

        // SECURITY

        else {

          navigate(
            "/security-dashboard"
          );
        }

      } else {

        alert(
          data.detail ||
          "Login Failed"
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

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center px-6">

      {/* MAIN CONTAINER */}

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2">

        {/* LEFT SECTION */}

        <div className="bg-slate-900 text-white p-14 flex flex-col justify-center">

          <h1 className="text-6xl font-bold leading-tight mb-6">

            Smart
            <br />
            Visitor
            <br />
            Management

          </h1>

          <p className="text-slate-300 text-lg leading-8 mb-10">

            Enterprise-grade
            visitor access management
            with QR authentication,
            security verification,
            live approvals,
            and automated tracking.

          </p>

          {/* FEATURES */}

          <div className="space-y-5">

            <div className="flex items-center gap-4">

              <div className="w-4 h-4 bg-green-400 rounded-full"></div>

              <span>
                Secure QR Authentication
              </span>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>

              <span>
                Real-Time Visitor Tracking
              </span>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>

              <span>
                Automated Email Notifications
              </span>

            </div>

            <div className="flex items-center gap-4">

              <div className="w-4 h-4 bg-pink-400 rounded-full"></div>

              <span>
                Industry-Level Security Workflow
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT SECTION */}

        <div className="p-14 flex flex-col justify-center">

          {/* LOGO */}

          <div className="mb-10 text-center">

            <div className="w-24 h-24 bg-slate-900 text-white rounded-3xl flex items-center justify-center text-4xl font-bold mx-auto mb-5 shadow-xl">

              SV

            </div>

            <h2 className="text-4xl font-bold text-slate-800">
              Welcome Back
            </h2>

            <p className="text-slate-500 mt-3 text-lg">
              Login to continue
            </p>

          </div>

          {/* ROLE */}

          <div className="flex justify-center gap-10 mb-8">

            {/* ADMIN */}

            <label className="flex items-center gap-3 text-lg font-semibold text-slate-700">

              <input
                type="radio"
                value="admin"
                checked={
                  role === "admin"
                }
                onChange={(e) =>
                  setRole(
                    e.target.value
                  )
                }
                className="w-5 h-5"
              />

              Admin

            </label>

            {/* SECURITY */}

            <label className="flex items-center gap-3 text-lg font-semibold text-slate-700">

              <input
                type="radio"
                value="security"
                checked={
                  role === "security"
                }
                onChange={(e) =>
                  setRole(
                    e.target.value
                  )
                }
                className="w-5 h-5"
              />

              Security

            </label>

          </div>

          {/* EMAIL */}

          <div className="mb-6">

            <label className="block mb-3 font-semibold text-slate-700">

              Email Address

            </label>

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full border border-slate-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />

          </div>

          {/* PASSWORD */}

          <div className="mb-8">

            <label className="block mb-3 font-semibold text-slate-700">

              Password

            </label>

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full border border-slate-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-700 text-white py-4 rounded-xl text-lg font-semibold transition duration-300 shadow-lg"
          >

            {
              loading
                ? "Logging In..."
                : "Login"
            }

          </button>

          {/* VISITOR FORM */}

          <button
            onClick={() =>
              navigate(
                "/visitor-form"
              )
            }
            className="w-full mt-5 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-lg font-semibold transition duration-300 shadow-lg"
          >

            Visitor Appointment Form

          </button>

          {/* FOOTER */}

          <div className="text-center mt-10 text-slate-400 text-sm">

            Smart Visitor Management System
            <br />
            Enterprise Security Platform

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;