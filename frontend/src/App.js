import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import VisitorForm from "./pages/VisitorForm";

import AdminDashboard from "./pages/AdminDashboard";
import SecurityDashboard from "./pages/SecurityDashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* VISITOR FORM */}

        <Route
          path="/visitor-form"
          element={<VisitorForm />}
        />

        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* SECURITY DASHBOARD */}

        <Route
          path="/security-dashboard"
          element={<SecurityDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;