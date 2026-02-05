import { useState } from "react";
import PrincipalLeaveApproval from "../components/PrincipalLeaveApproval";
import AllFacultyList from "../components/AllFacultyList";
import AllStudentList from "../components/AllStudentList";
import LeaveManagement from "../components/LeaveManagement";

export default function PrincipalDashboard() {

  const [tab, setTab] = useState("leave");

  return (
    <div className="erp-layout">

      {/* ===== SIDEBAR ===== */}
      <aside className="erp-sidebar">
        <h2 className="erp-logo">Principal</h2>

        <ul>
          <li onClick={() => setTab("leave")}>
            Leave Approval
          </li>

          <li onClick={() => setTab("leaveMgmt")}>
            Leave Management
          </li>

          <li onClick={() => setTab("faculty")}>
            All Faculty
          </li>

          <li onClick={() => setTab("students")}>
            All Students
          </li>
        </ul>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="erp-main">

        <header className="erp-header">
          <h3>Principal Dashboard</h3>
        </header>

        <div className="erp-content">
          {tab === "leave" && <PrincipalLeaveApproval />}
          {tab === "leaveMgmt" && <LeaveManagement />}
          {tab === "faculty" && <AllFacultyList />}
          {tab === "students" && <AllStudentList />}
        </div>

      </div>
    </div>
  );
}
