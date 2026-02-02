import { useState } from "react";
import PrincipalLeaveApproval from "../components/PrincipalLeaveApproval";
import AllFacultyList from "../components/AllFacultyList";
import AllStudentList from "../components/AllStudentList";

export default function PrincipalDashboard() {

  const [tab, setTab] = useState("leave");

  return (
    <div className="erp-layout">

      <aside className="erp-sidebar">
        <h2 className="erp-logo">Principal</h2>
        <ul>
          <li onClick={() => setTab("leave")}>Leave Approval</li>
          <li onClick={() => setTab("faculty")}>All Faculty</li>
          <li onClick={() => setTab("students")}>All Students</li>
        </ul>
      </aside>

      <div className="erp-main">
        <header className="erp-header">
          <h3>Principal Dashboard</h3>
        </header>

        <div className="erp-content">
          {tab === "leave" && <PrincipalLeaveApproval />}
          {tab === "faculty" && <AllFacultyList />}
          {tab === "students" && <AllStudentList />}
        </div>
      </div>

    </div>
  );
}
