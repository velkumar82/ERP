import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminCsvUpload from "../components/AdminCsvUpload";
import FacultyList from "../components/FacultyList";

import "../styles/dashboard.css";

export default function AdminDashboard() {
  const [page, setPage] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored login data (future ready)
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="erp-layout">

      {/* ===== SIDEBAR ===== */}
      <aside className="erp-sidebar">
        <h2 className="erp-logo">EduERP</h2>

        <ul>
          <li onClick={() => setPage("dashboard")}>Dashboard</li>
          <li onClick={() => setPage("faculty")}>Faculty</li>
          <li onClick={() => setPage("upload")}>Upload Timetable</li>
          <li onClick={() => setPage("reports")}>Attendance Reports</li>
          <li onClick={() => setPage("pdf")}>Generate PDF</li>
          <li onClick={handleLogout} style={{ color: "red", cursor: "pointer" }}>
            Logout
          </li>
        </ul>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="erp-main">

        {/* HEADER */}
        <header className="erp-header">
          <h3>Admin Dashboard</h3>
          <span>Welcome, Admin</span>
        </header>

        {/* CONTENT */}
        <div className="erp-content">

          {page === "dashboard" && (
            <div className="dashboard-grid">
              <div className="card">
                <h4>Timetable Management</h4>
                <p>Upload & manage faculty timetables using CSV</p>
              </div>


              <div className="card">
                <h4>Attendance Monitoring</h4>
                <p>View faculty & class-wise attendance</p>
              </div>

              <div className="card">
                <h4>Reports & PDF</h4>
                <p>Generate Anna University attendance register</p>
              </div>
            </div>
          )}
           {page === "faculty" && <FacultyList />}

          {page === "upload" && (
            <div className="card">
              <h4>Upload Timetable CSV</h4>
              <AdminCsvUpload />
            </div>
          )}

          {page === "reports" && (
            <div className="card">
              <h4>Attendance Reports</h4>
              <p>Reports module coming soon</p>
            </div>
          )}

          {page === "pdf" && (
            <div className="card">
              <h4>Generate Attendance PDF</h4>
              <a
                href="http://localhost:5000/api/attendance/pdf"
                target="_blank"
                rel="noreferrer"
              >
                <button className="btn-primary">Generate PDF</button>
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
