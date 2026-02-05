import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/leave.css";

export default function HODLeaveApproval() {
  const user = JSON.parse(localStorage.getItem("erpUser"));
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");

  /* =========================
     LOAD PENDING LEAVES
     ========================= */
  const loadLeaves = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/leave/hod/pending",
        { params: { department: user.department } }
      );
      setLeaves(res.data);
    } catch (err) {
      alert("Error fetching leave");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  /* =========================
     APPROVE
     ========================= */
  const approveLeave = async (id) => {
    if (!window.confirm("Approve this leave?")) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/leave/hod/approve/${id}`
      );
      alert(res.data.message);
      loadLeaves();
    } catch {
      alert("Approval failed");
    }
  };

  /* =========================
     REJECT
     ========================= */
  const rejectLeave = async (id) => {
    if (!reason.trim()) {
      alert("Enter rejection reason");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/leave/hod/reject/${id}`,
        { reason }
      );
      alert(res.data.message);
      setReason("");
      loadLeaves();
    } catch {
      alert("Rejection failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="card">
      <h3>HOD Leave Approval</h3>

      {leaves.length === 0 ? (
        <p>No pending leave requests</p>
      ) : (
        <table className="timetable">
          <thead>
            <tr>
              <th>Faculty</th>
              <th>From</th>
              <th>To</th>
              <th>Type</th>
              <th>Adjusted Faculty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l._id}>
                <td>{l.facultyName}</td>
                <td>{l.fromDate}</td>
                <td>{l.toDate}</td>
                <td>{l.leaveType}</td>
                <td>
                  {l.adjustments?.map((a, i) => (
                    <div key={i}>{a.adjustedFacultyId}</div>
                  ))}
                </td>
                <td>
                  <button
                    className="btn-success"
                    onClick={() => approveLeave(l._id)}
                  >
                    Approve
                  </button>

                  <br /><br />

                  <input
                    type="text"
                    placeholder="Reject reason"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />

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
