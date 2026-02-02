import { useEffect, useState } from "react";
import axios from "axios";

export default function PrincipalLeaveApproval() {

  const [leaves, setLeaves] = useState([]);

  const load = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/leave/pending/Principal"
    );
    setLeaves(res.data);
  };

  useEffect(() => { load(); }, []);

  const act = async (id, action) => {
    await axios.put(
      `http://localhost:5000/api/leave/approve/${id}`,
      { role: "Principal", action }
    );
    load();
  };

  return (
    <div className="card">
      <h3>Principal Leave Approval</h3>

      <table>
        <thead>
          <tr>
            <th>Faculty</th>
            <th>Department</th>
            <th>Dates</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(l => (
            <tr key={l._id}>
              <td>{l.facultyName}</td>
              <td>{l.department}</td>
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
