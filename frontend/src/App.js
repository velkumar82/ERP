import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HODDashboard from "./pages/HODDashboard";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import SecretaryDashboard from "./pages/SecretaryDashboard";


import "./styles/dashboard.css";
import "./styles/timetable.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/hod" element={<HODDashboard />} />
        <Route path="/principal" element={<PrincipalDashboard />} />
        <Route path="/secretary" element={<SecretaryDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}
