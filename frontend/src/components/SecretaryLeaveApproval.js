import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

export default function SecretaryLeaveApproval() {

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD PENDING LEAVES (SECRETARY)
  =============================== */
  const loadLeaves = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/leave/pending",
        {
          params: { role: "Secretary" }
        }
      );
      setLeaves(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  /* ===============================
     FINAL APPROVAL / REJECT
  =============================== */
  const approveLeave = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/leave/approve/${id}`
      );
      alert("Leave finally approved");
      loadLeaves();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const rejectLeave = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/leave/reject/${id}`
      );
      alert("Leave rejected");
      loadLeaves();
    } catch (err) {
      alert("Reject failed");
    }
  };

  return (
    <div className="card">
      <h3>Secretary Leave Approval (Final)</h3>

      {loading ? (
        <p>Loading...</p>
      ) : leaves.length === 0 ? (
        <p>No pending leave requests</p>
      ) : (
        <table className="timetable">
          <thead>
            <tr>
              <th>Faculty</th>
              <th>Role</th>
              <th>Department</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Final Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map(l => (
              <tr key={l._id}>
                <td>{l.facultyName}</td>
                <td>{l.role}</td>
                <td>{l.department}</td>
                <td>{l.fromDate}</td>
                <td>{l.toDate}</td>
                <td>{l.totalDays}</td>
                <td>{l.leaveType}</td>
                <td>{l.reason}</td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => approveLeave(l._id)}
                  >
                    Final Approve
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => rejectLeave(l._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
