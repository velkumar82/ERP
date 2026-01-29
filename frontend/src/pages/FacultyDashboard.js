import { useState } from "react";
import "../styles/dashboard.css";
import StudentAttendance from "../components/StudentAttendance";
import FacultyTimetable from "../components/FacultyTimetable";
import Biometric from "../components/Biometric";
import LeaveManagement from "../components/LeaveManagement";


export default function FacultyDashboard() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="erp-layout">

      {/* ===== SIDEBAR ===== */}
      <aside className="erp-sidebar">
        <h2 className="erp-logo">EduERP</h2>

        <ul>
          <li onClick={() => setPage("dashboard")}>Dashboard</li>
          <li onClick={() => setPage("biometric")}>Biometric</li>
          <li onClick={() => setPage("timetable")}>My Timetable</li>
          <li onClick={() => setPage("attendance")}>Student Attendance</li>
          <li onClick={() => setPage("leave")}>Leave Management</li>
          <li onClick={() => setPage("reports")}>Reports</li>
          <li>Logout</li>
        </ul>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="erp-main">

        {/* HEADER */}
        <header className="erp-header">
          <h3>Faculty Dashboard</h3>
          <span>Welcome, Faculty</span>
        </header>

        {/* CONTENT */}
        <div className="erp-content">

          {/* DASHBOARD */}
          {page === "dashboard" && (
            <div className="dashboard-grid">
              <div className="card profile-card">
                <img src="https://i.pravatar.cc/100" alt="profile" />
                <h4>Dr. Velkumar</h4>
                <p>Department: CSE</p>
                <p>Role: Faculty</p>
              </div>

              <div className="card">
                <h4>Today's Timetable</h4>
                <ul>
                  <li>2nd Hour – DBMS – CSE II A</li>
                  <li>4th Hour – OS – CSE II A</li>
                </ul>
              </div>

              <div className="card">
                <h4>Notice Board</h4>
                <p>📢 Internal exams start next week</p>
                <p>📢 Faculty meeting on Friday</p>
              </div>
            </div>
          )}

          {page === "biometric" && <Biometric />}


          {/* ✅ FIXED: REAL TIMETABLE COMPONENT */}
          {page === "timetable" && <FacultyTimetable />}

          {/* STUDENT ATTENDANCE */}
          {page === "attendance" && <StudentAttendance />}
          {page === "leave" && <LeaveManagement />}

          {/* REPORTS */}
          {page === "reports" && (
            <div className="card">
              <h4>Reports</h4>
              <p>Attendance reports will appear here</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
