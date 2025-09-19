import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      const { role } = res.data;
      if (role === "student") navigate("/student-dashboard");
      else if (role === "admin") navigate("/admin-dashboard");
      else if (role === "faculty") navigate("/faculty-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    
    <div data-theme="retro">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-outline" type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        <a href="/register">Register</a> |{" "}
        <a href="/forgot">Forgot Password?</a> |{" "}
        <a href="/admin-login">Admin Login</a>
      </p>
    </div>
  );
}

export default Login;
