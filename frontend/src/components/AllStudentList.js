import { useEffect, useState } from "react";
import axios from "axios";

export default function AllStudentList() {

  const [dept, setDept] = useState("");
  const [year, setYear] = useState("II");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/attendance/students", {
      params: { department: dept, year }
    }).then(res => setStudents(res.data));
  }, [dept, year]);

  return (
    <div className="card">
      <h3>All Students</h3>

      <div className="form-row">
        <select onChange={e => setDept(e.target.value)}>
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="ECE">ECE</option>
        </select>

        <select onChange={e => setYear(e.target.value)}>
          <option value="II">II Year</option>
          <option value="III">III Year</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Reg No</th>
            <th>Name</th>
            <th>Department</th>
            <th>Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.registerNo}>
              <td>{s.registerNo}</td>
              <td>{s.name}</td>
              <td>{s.department}</td>
              <td>{s.attendancePercentage || 0}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
