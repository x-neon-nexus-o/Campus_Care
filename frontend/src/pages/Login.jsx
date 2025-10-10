import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { login } = useAuth();
  
  // Get redirect path from URL params or state
  const from = location.state?.from || new URLSearchParams(location.search).get('redirect') || null;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password && password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    
    // Validate email
    if (!email) {
      toast.error("Email is required");
      setError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      setError("Please enter a valid email address");
      return;
    }
    
    // Validate password
    if (!password) {
      toast.error("Password is required");
      setError("Password is required");
      return;
    }
    
    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters long");
      setError("Password must be at least 6 characters long");
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
        
        // If there's a redirect path, use it (for complaint submission flow)
        if (from) {
          navigate(from, { replace: true });
        } else {
          // Default role-based navigation
          if (role === "admin") navigate("/admin-dashboard");
          else if (role === "faculty") navigate("/track-complaints");
          else if (role === "head") navigate("/admin-dashboard"); // Department heads use admin dashboard
          else navigate("/track-complaints");
        }
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
                className={`w-full input input-bordered ${
                  email && !validateEmail(email) ? 'input-error' : 'input-primary'
                }`}
                required 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
              />
              {email && !validateEmail(email) && (
                <span className="text-sm text-error">Please enter a valid email address</span>
              )}
            </div>
            <div className="mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input 
                type="password" 
                placeholder="Enter Password" 
                className={`w-full input input-bordered ${
                  password && !validatePassword(password) ? 'input-error' : 'input-primary'
                }`}
                required 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
              />
              {password && !validatePassword(password) && (
                <span className="text-sm text-error">Password must be at least 6 characters long</span>
              )}
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
