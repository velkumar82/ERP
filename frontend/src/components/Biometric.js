import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/dashboard.css";

export default function Biometric() {

  const user = JSON.parse(localStorage.getItem("erpUser"));

  const [year, setYear] = useState("2025-2026");
  const [month, setMonth] = useState("01");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!user) return;

    axios.get("http://localhost:5000/api/biometric", {
      params: {
        facultyId: user.userId,
        academicYear: year,
        month
      }
    })
    .then(res => setRecords(res.data))
    .catch(() => setRecords([]));

  }, [year, month]);

  return (
    <div className="card">
      <h3>Biometric Attendance</h3>

      {/* FILTER */}
      <div style={{ display: "flex", gap: 15, marginBottom: 15 }}>
        <select value={year} onChange={e => setYear(e.target.value)}>
          <option>2024-2025</option>
          <option>2025-2026</option>
          <option>2026-2027</option>
        </select>

        <select value={month} onChange={e => setMonth(e.target.value)}>
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

      {/* TABLE */}
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
          {records.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No biometric data
              </td>
            </tr>
          ) : (
            records.map((r, i) => (
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.day}</td>
                <td>{r.inTime}</td>
                <td>{r.outTime}</td>
                <td>{r.remark}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
