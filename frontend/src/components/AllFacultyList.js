import { useEffect, useState } from "react";
import axios from "axios";

export default function AllFacultyList() {

  const [dept, setDept] = useState("");
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then(res => setFaculty(res.data));
  }, []);

  const filtered = dept
    ? faculty.filter(f => f.department === dept)
    : faculty;

  return (
    <div className="card">
      <h3>All Faculty</h3>

      <select onChange={e => setDept(e.target.value)}>
        <option value="">All Departments</option>
        <option value="CSE">CSE</option>
        <option value="IT">IT</option>
        <option value="ECE">ECE</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(f => (
            <tr key={f.userId}>
              <td>{f.userId}</td>
              <td>{f.username}</td>
              <td>{f.department}</td>
              <td>{f.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
