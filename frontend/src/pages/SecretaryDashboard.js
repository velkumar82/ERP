 import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";
import LeaveApproval from "../components/SecretaryLeaveApproval";

export default function SecretaryDashboard() {

  const [leaves, setLeaves] = useState([]);

  const loadLeaves = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/leave/pending",
      { params: { role: "Secretary" } }
    );
    setLeaves(res.data);
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  return (
    <div className="erp-content">
      <h2>Secretary Dashboard</h2>

      <div className="card">
        <h3>Final Leave Approvals</h3>
        <LeaveApproval leaves={leaves} reload={loadLeaves} />
      </div>
    </div>
  );
}
