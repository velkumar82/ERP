export default function LeaveCheck({
  leaves,
  remainingCL,
  cancelLeave
}) {
  const monthName = new Date().toLocaleString("en-US", { month: "long" });

  const approvedCL = leaves.filter(
    l => l.leaveType === "CL" && l.status === "Approved"
  ).length;

  const pendingCL = leaves.filter(
    l => l.leaveType === "CL" && l.status === "Pending"
  ).length;

  return (
    <div>
      <h4>Leave Balance – {monthName}</h4>

      {/* LEAVE SUMMARY */}
      <table className="timetable">
        <thead>
          <tr>
            <th>Leave Type</th>
            <th>Total</th>
            <th>Approved</th>
            <th>Pending</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Casual Leave (CL)</td>
            <td>1</td>
            <td>{approvedCL}</td>
            <td>{pendingCL}</td>
            <td style={{ fontWeight: "bold", color: remainingCL > 0 ? "green" : "red" }}>
              {remainingCL}
            </td>
          </tr>
        </tbody>
      </table>

      {/* APPLIED LEAVES */}
      <h4 style={{ marginTop: 20 }}>Applied Leaves</h4>

      {leaves.length === 0 ? (
        <p>No leave applied</p>
      ) : (
        <table className="timetable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Leave Type</th>
              <th>Session</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l, i) => (
              <tr key={i}>
                <td>{l.date}</td>
                <td>{l.leaveType}</td>
                <td>{l.session}</td>
                <td>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: l.status === "Approved" ? "green" : "orange"
                    }}
                  >
                    {l.status}
                  </span>
                </td>
                <td>
                  {l.status === "Pending" && (
                    <button
                      style={{ color: "red" }}
                      onClick={() => cancelLeave(i)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
