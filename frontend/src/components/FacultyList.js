import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/faculty.css";

export default function FacultyList() {

  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    userId: "",
    username: "",
    designation: "",
    department: "",
    role: "",
    email: "",
    password: ""
  });

  /* =========================
     LOAD USERS
  ========================= */
  const loadUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* =========================
     CREATE USER
  ========================= */
  const handleCreate = async () => {

    if (!form.userId || !form.username || !form.designation || !form.department || !form.role) {
      alert("User ID, Name, Designation, Department and Role are required");
      return;
    }

    try {
      const payload = {
        userId: form.userId.trim(),
        username: form.username.trim(),
        designation: form.designation.trim(),
        department: form.department.trim(),
        email: form.email.trim(),
        role: form.role,
        password: form.password || `${form.userId}@123`
      };

      await axios.post("http://localhost:5000/api/users/create", payload);

      alert(`User created successfully\nDefault Password: ${payload.password}`);

      setForm({
        userId: "",
        username: "",
        designation: "",
        department: "",
        role: "",
        email: "",
        password: ""
      });

      setShowForm(false);
      loadUsers();

    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  return (
    <div className="card faculty-container">

      {/* ===== HEADER ===== */}
      <div className="faculty-header">
        <h3>User Management</h3>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close" : "+ Create User"}
        </button>
      </div>

      {/* ===== CREATE FORM ===== */}
      {showForm && (
        <div className="faculty-form">

          <input
            type="text"
            placeholder="User ID (Eg: F001)"
            value={form.userId}
            onChange={e => setForm({ ...form, userId: e.target.value })}
          />

          <input
            type="text"
            placeholder="Name"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />

          {/* DESIGNATION */}
          <select
            value={form.designation}
            onChange={e => setForm({ ...form, designation: e.target.value })}
          >
            <option value="">Select Designation</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Professor">Professor</option>
            <option value="HOD">HOD</option>
            <option value="Principal">Principal</option>
            <option value="Secretary">Secretary</option>
          </select>

          {/* DEPARTMENT */}
          <select
            value={form.department}
            onChange={e => setForm({ ...form, department: e.target.value })}
          >
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="MECH">Mechanical</option>
            <option value="CIVIL">Civil</option>
            <option value="ALL">ALL</option>
          </select>

          {/* ROLE */}
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="">Select Role</option>
            <option value="Faculty">Faculty</option>
            <option value="HOD">HOD</option>
            <option value="Principal">Principal</option>
            <option value="Admin">Admin</option>
            <option value="Secretary">Secretary</option>
          </select>

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password (optional)"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <button className="btn-primary" onClick={handleCreate}>
            Save User
          </button>
        </div>
      )}

      {/* ===== USER TABLE ===== */}
      {users.length === 0 ? (
        <p className="no-data">No user records found</p>
      ) : (
        <table className="faculty-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Role</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => (
              <tr key={index}>
                <td>{u.userId}</td>
                <td>{u.username}</td>
                <td>{u.designation || "-"}</td>
                <td>{u.department || "-"}</td>
                <td className="status-active">{u.role}</td>
                <td>{u.email || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}
