import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import VisitorForm from "./pages/VisitorForm";

import AdminDashboard from "./pages/AdminDashboard";
import SecurityDashboard from "./pages/SecurityDashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/visitor-form"
          element={<VisitorForm />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/security-dashboard"
          element={<SecurityDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;