import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/app.css";

export default function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!userId || !password || !role) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        userId,
        password,
        role: role === "admin" ? "Admin" : "Faculty"
      });

      // Save login session
      localStorage.setItem("erpUser", JSON.stringify(res.data.user));

      // Role-based navigation
      if (res.data.user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/faculty");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Server error"
      );
    }
  };

  return (
    <div className="login-container">
      <h2>ERP Login</h2>

      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={e => setUserId(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="faculty">Faculty</option>
      </select>

      <button onClick={handleLogin}>Login</button>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}
