import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import PrivacyAccessModal from '../components/PrivacyAccessModal';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.endsWith('@famt.ac.in')) {
      setError('Only @famt.ac.in emails allowed');
      return;
    }
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Show privacy modal before registration
    setPendingRegistration({ email, password });
    setShowPrivacyModal(true);
  };

  const handlePrivacyAccept = async () => {
    setShowPrivacyModal(false);
    
    if (!pendingRegistration) return;
    
    try {
      // Register the user
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: pendingRegistration.email, 
          password: pendingRegistration.password 
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await res.json();
      
      // Automatically log in the user after registration
      const loginResult = await login(pendingRegistration.email, pendingRegistration.password);
      if (loginResult.success) {
        toast.success('Registration successful! You are now logged in.');
        navigate('/track-complaints');
      } else {
        setError('Registration successful but login failed. Please try logging in manually.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setPendingRegistration(null);
    }
  };

  const handlePrivacyCancel = () => {
    setShowPrivacyModal(false);
    setPendingRegistration(null);
  };

  return (
    <>
      <div className="relative flex flex-col justify-center min-h-screen overflow-hidden mb-9">
        <div className="w-full p-6 m-auto rounded-md shadow-md lg:max-w-md bg-base-100">
          {/* Title */}
          <h1 className="text-3xl font-semibold text-center text-primary">
            Register (Students Only)
          </h1>

          {/* Form */}
          <form className="mt-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="label">
                <span className="label-text">Email (@famt.ac.in)</span>
              </label>
              <input
                type="email"
                placeholder="Enter your college email"
                className="w-full input input-bordered input-primary"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full input input-bordered input-primary"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button type="submit" className="w-full btn btn-primary">
                Register
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <p className="mt-3 text-sm text-center text-red-500">{error}</p>
          )}

          {/* Back to Login */}
          <p className="mt-8 text-xs font-light text-center text-primary">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Privacy & Access Modal */}
      <PrivacyAccessModal
        isOpen={showPrivacyModal}
        onClose={handlePrivacyCancel}
        onAccept={handlePrivacyAccept}
        userRole="student"
      />
    </>
  );
}

export default Register;