import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    try {
      const res = await api.post('/register', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
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
  );
}

export default Register;