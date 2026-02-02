import { useEffect, useState } from "react";
import axios from "axios";

export default function DepartmentStudentList() {

  const user = JSON.parse(localStorage.getItem("erpUser"));
  const [year, setYear] = useState("II");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/attendance/students", {
      params: {
        department: user.department,
        year
      }
    }).then(res => setStudents(res.data));
  }, [year]);

  return (
    <div className="card">
      <h3>{user.department} Students</h3>

      <select onChange={e => setYear(e.target.value)}>
        <option value="II">II Year</option>
        <option value="III">III Year</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Reg No</th>
            <th>Name</th>
            <th>Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.registerNo}>
              <td>{s.registerNo}</td>
              <td>{s.name}</td>
              <td>{s.attendancePercentage || 0}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
