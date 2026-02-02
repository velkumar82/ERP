import { useEffect, useState } from "react";
import axios from "axios";

export default function HODLeaveApproval() {

  const user = JSON.parse(localStorage.getItem("erpUser"));
  const [leaves, setLeaves] = useState([]);

  const loadLeaves = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/leave/pending/HOD`
    );
    setLeaves(res.data.filter(l => l.department === user.department));
  };

  useEffect(() => { loadLeaves(); }, []);

  const act = async (id, action) => {
    await axios.put(
      `http://localhost:5000/api/leave/approve/${id}`,
      { role: "HOD", action }
    );
    loadLeaves();
  };

  return (
    <div className="card">
      <h3>Pending Leave Requests</h3>

      <table>
        <thead>
          <tr>
            <th>Faculty</th>
            <th>Type</th>
            <th>Dates</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(l => (
            <tr key={l._id}>
              <td>{l.facultyName}</td>
              <td>{l.leaveType}</td>
              <td>{l.fromDate} → {l.toDate}</td>
              <td>
                <button onClick={() => act(l._id, "Approve")}>Approve</button>
                <button onClick={() => act(l._id, "Reject")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
