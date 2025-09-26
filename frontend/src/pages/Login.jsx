import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import PrivacyAccessModal from "../components/PrivacyAccessModal";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [pendingLogin, setPendingLogin] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Show privacy modal before login
    setPendingLogin({ email, password });
    setShowPrivacyModal(true);
  };

  const handlePrivacyAccept = async () => {
    setShowPrivacyModal(false);
    
    if (!pendingLogin) return;
    
    try {
      const result = await login(pendingLogin.email, pendingLogin.password);
      if (result.success) {
        const { role } = result.user;
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "faculty") navigate("/track-complaints");
        else if (role === "head") navigate("/admin-dashboard"); // Department heads use admin dashboard
        else navigate("/track-complaints");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setPendingLogin(null);
    }
  };

  const handlePrivacyCancel = () => {
    setShowPrivacyModal(false);
    setPendingLogin(null);
  };

  return (
    <>
      <div className="relative flex flex-col justify-center min-h-screen overflow-hidden mb-9">
        <div className="w-full p-6 m-auto rounded-md shadow-md lg:max-w-md">
          <h1 className="text-3xl font-semibold text-center text-primary">Login</h1>
          <form className="mt-6" onSubmit={handleSubmit}>
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full input input-bordered input-primary" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="Enter Password" 
                className="w-full input input-bordered input-primary" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-2 text-right">
              <Link to="/forgot" className="text-xs text-primary hover:underline">Forgot Password?</Link>
            </div>
            <div className="mt-6">
              <button type="submit" className="btn btn-primary w-full">Login</button>
            </div>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p className="mt-8 text-xs font-light text-center text-primary">
            Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Register</Link>
          </p>
        </div>
      </div>

      {/* Privacy & Access Modal */}
      <PrivacyAccessModal
        isOpen={showPrivacyModal}
        onClose={handlePrivacyCancel}
        onAccept={handlePrivacyAccept}
        userRole="student" // Default role, will be updated based on actual user role
      />
      
      <Toaster />
    </>
  );
}

export default Login;
