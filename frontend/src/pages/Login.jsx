import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
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
    <>
    {/* <div data-theme="retro">
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
        <Toaster/>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <p>
        <Link to="/register">Register</Link>
        <Link to="/forgot">Forgot Password?</Link>
        <Link to="/admin-login">Admin Login</Link>
      </p>
    </div>  */}

     
    <div class="relative flex flex-col justify-center min-h-screen overflow-hidden mb-9">
  <div class="w-full p-6 m-auto  rounded-md shadow-md lg:max-w-md">
    <h1 class="text-3xl font-semibold text-center text-primary">Login</h1>
    <form class="mt-6" onSubmit={handleSubmit}>
      <div>
        <label class="label">
          <span class="label-text">Email</span>
        </label>
        <input type="email" placeholder="Email Address" class="w-full input input-bordered input-primary" required value={email}
          onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div class="mt-4">
        <label class="label">
          <span class="label-text">Password</span>
        </label>
        <input type="password" placeholder="Enter Password" class="w-full input input-bordered input-primary" required value={password}
          onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <div class="mt-2 text-right">
        <Link to="/forgot" class="text-xs text-primary hover:underline">Forgot Password?</Link>
      </div>
      <div class="mt-6">
        <button type="submit" class="btn btn-primary w-full">Login</button>
      </div>
    </form>
     {error && <p style={{ color: "red" }}>{error}</p>}
    <p class="mt-8 text-xs font-light text-center text-primary">
      Don't have an account? <Link to="/register" class="font-medium text-primary hover:underline">Register</Link>
    </p>
  </div>
</div>
    </>
  );
}

export default Login;
