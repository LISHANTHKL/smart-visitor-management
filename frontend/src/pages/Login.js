import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("admin");

  const handleLogin = async () => {

    if (
      role === "admin" &&
      email === "admin@gmail.com" &&
      password === "admin123"
    ) {

      navigate("/admin-dashboard");

    } else if (
      role === "security" &&
      email === "security@gmail.com" &&
      password === "security123"
    ) {

      navigate("/security-dashboard");

    } else {

      alert("Invalid Credentials");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[500px]">

        <h1 className="text-5xl font-bold mb-10 text-center">
          Welcome Back
        </h1>

        <div className="flex justify-center gap-10 mb-8">

          <label>
            <input
              type="radio"
              checked={role === "admin"}
              onChange={() =>
                setRole("admin")
              }
            />
            <span className="ml-2">
              Admin
            </span>
          </label>

          <label>
            <input
              type="radio"
              checked={role === "security"}
              onChange={() =>
                setRole("security")
              }
            />
            <span className="ml-2">
              Security
            </span>
          </label>

        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-4 rounded-xl mb-5"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-4 rounded-xl mb-8"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          className="w-full bg-slate-900 text-white p-4 rounded-xl mb-5"
        >
          Login
        </button>

        <button
          onClick={() =>
            navigate("/visitor-form")
          }
          className="w-full bg-green-500 text-white p-4 rounded-xl"
        >
          Visitor Appointment Form
        </button>

      </div>

    </div>
  );
}

export default Login;