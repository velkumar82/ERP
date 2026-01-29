import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/faculty.css";

export default function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    name: "",
    department: "",
    email: "",
    mobile: ""
  });

  /* ===== LOAD FACULTY LIST ===== */
  const loadFaculty = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/faculty");
      setFaculty(res.data);
    } catch (err) {
      console.error("Error loading faculty", err);
    }
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  /* ===== CREATE FACULTY ===== */
  const handleCreate = async () => {
    if (!form.userId || !form.name || !form.department) {
      alert("Faculty ID, Name and Department are required");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/create-faculty", form);

      alert(
        `Faculty created successfully\nDefault Password: ${form.userId}@123`
      );

      setForm({
        userId: "",
        name: "",
        department: "",
        email: "",
        mobile: ""
      });

      setShowForm(false);
      loadFaculty();

    } catch (err) {
      alert(err.response?.data?.message || "Error creating faculty");
    }
  };

  return (
    <div className="card faculty-container">

      {/* HEADER */}
      <div className="faculty-header">
        <h3>Faculty Management</h3>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "+ Create Faculty"}
        </button>
      </div>

      {/* CREATE FORM */}
      {showForm && (
        <div className="faculty-form">
          <input
            type="text"
            placeholder="Faculty ID (Eg: F001)"
            value={form.userId}
            onChange={e => setForm({ ...form, userId: e.target.value })}
          />

          <input
            type="text"
            placeholder="Faculty Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={e => setForm({ ...form, department: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="text"
            placeholder="Mobile"
            value={form.mobile}
            onChange={e => setForm({ ...form, mobile: e.target.value })}
          />

          <button className="btn-primary" onClick={handleCreate}>
            Save Faculty
          </button>
        </div>
      )}

      {/* FACULTY TABLE */}
      {faculty.length === 0 ? (
        <p className="no-data">No faculty records found</p>
      ) : (
        <table className="faculty-table">
          <thead>
            <tr>
              <th>Faculty ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {faculty.map((f, index) => (
              <tr key={index}>
                <td>{f.userId}</td>
                <td>{f.name}</td>
                <td>{f.department}</td>
                <td>{f.email || "-"}</td>
                <td>{f.mobile || "-"}</td>
                <td className="status-active">{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}
