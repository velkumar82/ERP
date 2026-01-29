import { useState } from "react";
import LeaveCheck from "./LeaveCheck";
import LeaveApply from "./LeaveApply";

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("check");

  // 🔐 Central Leave State (MONTH-WISE)
  const [leaves, setLeaves] = useState([]);

  // Month-wise CL policy
  const totalCL = 1;

  // Count CLs
  const appliedCL = leaves.filter(l => l.leaveType === "CL").length;
  const remainingCL = totalCL - appliedCL;

  // Apply Leave
  const applyLeave = (leave) => {
    setLeaves([...leaves, leave]);
    setActiveTab("check");
  };

  // Cancel Leave
  const cancelLeave = (index) => {
    const updated = [...leaves];
    updated.splice(index, 1);
    setLeaves(updated);
  };

  return (
    <div className="card">

      <h3>Leave Management</h3>

      {/* SUB MENU */}
      <div className="leave-menu">
        <button
          className={activeTab === "check" ? "leave-btn active" : "leave-btn"}
          onClick={() => setActiveTab("check")}
        >
          Leave Check
        </button>

        <button
          className={activeTab === "apply" ? "leave-btn active" : "leave-btn"}
          onClick={() => setActiveTab("apply")}
        >
          Leave Apply
        </button>
      </div>

      {/* CONTENT */}
      {activeTab === "check" && (
        <LeaveCheck
          leaves={leaves}
          remainingCL={remainingCL}
          cancelLeave={cancelLeave}
        />
      )}

      {activeTab === "apply" && (
        <LeaveApply
          remainingCL={remainingCL}
          applyLeave={applyLeave}
        />
      )}

    </div>
  );
}
