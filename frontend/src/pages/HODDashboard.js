import { useState } from "react";
import HODLeaveApproval from "../components/HODLeaveApproval";
import DepartmentFacultyList from "../components/DepartmentFacultyList";
import DepartmentStudentList from "../components/DepartmentStudentList";
import LeaveManagement from "../components/LeaveManagement";

export default function HODDashboard() {

  const [tab, setTab] = useState("leave");

  return (
    <div className="erp-layout">

      {/* SIDEBAR */}
      <aside className="erp-sidebar">
        <h2 className="erp-logo">HOD Panel</h2>
        <ul>
          <li onClick={() => setTab("leave")}>Leave Approval</li>
          <li onClick={() => setTab("leave")}>Leave Management</li>
          <li onClick={() => setTab("faculty")}>Department Faculty</li>
          <li onClick={() => setTab("students")}>Department Students</li>
        </ul>
      </aside>

      {/* MAIN */}
      <div className="erp-main">
        <header className="erp-header">
          <h3>HOD Dashboard</h3>
        </header>

        <div className="erp-content">
          {tab === "leave" && <HODLeaveApproval />}
          {tab === "leaveMgmt" && <LeaveManagement />}
          {tab === "faculty" && <DepartmentFacultyList />}
          {tab === "students" && <DepartmentStudentList />}
        </div>
      </div>

    </div>
  );
}
