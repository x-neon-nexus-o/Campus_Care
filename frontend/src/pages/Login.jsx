import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../utils/validationSchemas";
import toast, { Toaster } from "react-hot-toast";
import PrivacyAccessModal from "../components/PrivacyAccessModal";

function Login() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [pendingLogin, setPendingLogin] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get redirect path from URL params or state
  const from = location.state?.from || new URLSearchParams(location.search).get('redirect') || null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    // Show privacy modal before login
    setPendingLogin(data);
    setShowPrivacyModal(true);
  };

  const handlePrivacyAccept = async () => {
    setShowPrivacyModal(false);

    if (!pendingLogin) return;

    try {
      const result = await login(pendingLogin.email, pendingLogin.password);
      if (result.success) {
        const { role } = result.user;
        toast.success("Login successful!");

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
        setFormError('root', { message: result.message });
        toast.error(result.message);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setFormError('root', { message });
      toast.error(message);
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
        <div className="w-full p-6 m-auto rounded-md shadow-md lg:max-w-md bg-base-100">
          <h1 className="text-3xl font-semibold text-center text-primary">Login</h1>
          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email Address"
                className={`w-full input input-bordered ${errors.email ? 'input-error' : 'input-primary'
                  }`}
                {...register('email')}
              />
              {errors.email && (
                <span className="text-sm text-error">{errors.email.message}</span>
              )}
            </div>
            <div className="mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className={`w-full input input-bordered ${errors.password ? 'input-error' : 'input-primary'
                  }`}
                {...register('password')}
              />
              {errors.password && (
                <span className="text-sm text-error">{errors.password.message}</span>
              )}
            </div>
            <div className="mt-2 text-right">
              <Link to="/forgot" className="text-xs text-primary hover:underline">Forgot Password?</Link>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </div>

            {errors.root && (
              <div className="mt-3 text-sm text-center text-red-500">{errors.root.message}</div>
            )}
          </form>

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
