import { useEffect, useState } from "react";
import axios from "axios";

export default function AlternateLeaveApproval() {
  const user = JSON.parse(localStorage.getItem("erpUser"));
  const [leaves, setLeaves] = useState([]);
  const [reason, setReason] = useState("");
  const [rejectId, setRejectId] = useState(null);

  const loadLeaves = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/leave/alternate/${user.userId}`
      );
      setLeaves(res.data);
    } catch {
      alert("Error loading alternate approvals");
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const approve = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/leave/alternate/approve/${id}`
      );
      alert(res.data.message);
      loadLeaves();
    } catch {
      alert("Action failed");
    }
  };

  const reject = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/leave/alternate/reject/${rejectId}`,
        { reason }
      );
      alert(res.data.message);
      setRejectId(null);
      setReason("");
      loadLeaves();
    } catch {
      alert("Reject failed");
    }
  };

  return (
    <div className="card">
      <h3>Alternate Leave Approval</h3>

      {leaves.length === 0 ? (
        <p>No pending adjustments</p>
      ) : (
        <table className="timetable">
          <thead>
            <tr>
              <th>Faculty</th>
              <th>Date</th>
              <th>Hour</th>
              <th>Subject</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map(l => (
              <tr key={l._id}>
                <td>{l.facultyName}</td>
                <td>{l.fromDate}</td>
                <td>{l.adjustments[0]?.hour}</td>
                <td>{l.adjustments[0]?.subject}</td>
                <td>
                  <button onClick={() => approve(l._id)}>Approve</button>
                  <button onClick={() => setRejectId(l._id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {rejectId && (
        <div style={{ marginTop: 15 }}>
          <textarea
            placeholder="Enter rejection reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
          <br />
          <button onClick={reject}>Submit Rejection</button>
        </div>
      )}
    </div>
  );
}
