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

    // ===== BASIC VALIDATION =====
    if (!userId || !password || !role) {
      setError("All fields are required");
      return;
    }

    try {
      // ===== API CALL =====
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          userId: userId.trim(),
          password: password.trim()
        }
      );

      const user = res.data.user;

      // ===== ROLE CHECK (CASE SAFE) =====
      if (user.role.toLowerCase() !== role.toLowerCase()) {
        setError("Unauthorized role");
        return;
      }

      // ===== SAVE SESSION =====
      localStorage.setItem("erpUser", JSON.stringify(user));

      // ===== ROLE BASED REDIRECT =====
      switch (user.role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Faculty":
          navigate("/faculty");
          break;
        case "HOD":
          navigate("/hod");
          break;
        case "Principal":
          navigate("/principal");
          break;
        default:
          setError("Invalid user role");
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
        <option value="Admin">Admin</option>
        <option value="Faculty">Faculty</option>
        <option value="HOD">HOD</option>
        <option value="Principal">Principal</option>
      </select>

      <button onClick={handleLogin}>
        Login
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
