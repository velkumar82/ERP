import { useEffect, useState } from "react";
import axios from "axios";

export default function LeaveCheck() {

  const user = JSON.parse(localStorage.getItem("erpUser"));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSummary = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/leave/summary/${user.userId}`
      );

      setData({
        totalCL: res.data.totalCL || 0,
        usedCL: res.data.usedCL || 0,
        remainingCL: res.data.remainingCL || 0,
        leaves: res.data.leaves || []
      });

    } catch (err) {
      alert("Error loading leave summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const cancelLeave = async (id) => {
    if (!window.confirm("Cancel this leave?")) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/leave/cancel/${id}`
      );
      alert(res.data.message);
      loadSummary();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data</p>;

  return (
    <div className="card">
      <h3>Leave Summary</h3>

      <table>
        <tbody>
          <tr><td>Total CL</td><td>{data.totalCL}</td></tr>
          <tr><td>Used CL</td><td>{data.usedCL}</td></tr>
          <tr><td>Remaining CL</td><td>{data.remainingCL}</td></tr>
        </tbody>
      </table>

      <h4 style={{ marginTop: 20 }}>Leave History</h4>

      {data.leaves.length === 0 ? (
        <p>No leave records</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.leaves.map(l => {
              const normalizedStatus = l.status.replace(/\s+/g, "-");

              return (
                <tr key={l._id}>
                  <td>{l.fromDate}</td>
                  <td>{l.toDate}</td>
                  <td>{l.leaveType}</td>
                  <td>{l.status}</td>
                  <td>
                    {["Pending-HOD", "Pending-Principal"].includes(normalizedStatus) && (
                      <button
                        className="btn-danger"
                        onClick={() => cancelLeave(l._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
