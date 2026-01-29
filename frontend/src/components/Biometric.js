import { useState, useEffect } from "react";
import "../styles/dashboard.css";

export default function Biometric({ leaves = [] }) {

  const [year, setYear] = useState("2025-2026");
  const [month, setMonth] = useState("01"); // January
  const [records, setRecords] = useState([]);

  /* ===== HELPERS ===== */

  const academicYearMap = {
    "2024-2025": 2024,
    "2025-2026": 2025,
    "2026-2027": 2026
  };

  const getLeaveRemark = (date) => {
    const leave = leaves.find(l => l.date === date);
    if (!leave) return "";
    if (leave.status === "Pending") return "Pending Approval";
    return leave.leaveType; // CL or LOP
  };

  /* ===== GENERATE MONTH DATA ===== */
  useEffect(() => {
    const baseYear = academicYearMap[year];
    const monthIndex = parseInt(month) - 1;
    const daysInMonth = new Date(baseYear, monthIndex + 1, 0).getDate();

    const temp = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(baseYear, monthIndex, d);
      const dateStr = dateObj.toISOString().split("T")[0];
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

      if (dayName === "Sunday") {
        temp.push({
          date: dateStr,
          day: dayName,
          in: "",
          out: "",
          remark: "Sunday"
        });
      } else {
        temp.push({
          date: dateStr,
          day: dayName,
          in: "",
          out: "",
          remark: getLeaveRemark(dateStr)
        });
      }
    }

    setRecords(temp);
  }, [year, month, leaves]);

  return (
    <div className="card">
      <h3>Biometric Attendance</h3>

      {/* ===== FILTERS ===== */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option>2024-2025</option>
          <option>2025-2026</option>
          <option>2026-2027</option>
        </select>

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>

      {/* ===== BIOMETRIC TABLE ===== */}
      <table className="timetable">
        <thead>
          <tr>
            <th>Date</th>
            <th>Day</th>
            <th>In</th>
            <th>Out</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td>{r.day}</td>
              <td>{r.in}</td>
              <td>{r.out}</td>
              <td>{r.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
