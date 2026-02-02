import { useEffect, useState } from "react";
import axios from "axios";

export default function DepartmentFacultyList() {

  const user = JSON.parse(localStorage.getItem("erpUser"));
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then(res =>
        setFaculty(
          res.data.filter(
            u => u.department === user.department && u.role === "Faculty"
          )
        )
      );
  }, []);

  return (
    <div className="card">
      <h3>{user.department} Faculty List</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Designation</th>
          </tr>
        </thead>
        <tbody>
          {faculty.map(f => (
            <tr key={f.userId}>
              <td>{f.userId}</td>
              <td>{f.username}</td>
              <td>{f.designation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
