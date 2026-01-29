import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import FacultyDashboard from "./pages/FacultyDashboard.js";
import AdminDashboard from "./pages/AdminDashboard";
import "./styles/dashboard.css";
import "./styles/timetable.css";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
