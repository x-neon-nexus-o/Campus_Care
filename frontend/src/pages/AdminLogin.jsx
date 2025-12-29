import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          setError('Unauthorized: Not an admin account');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    //  <div data-theme="retro" className=''>
    //     <h2>Admin Login</h2>
    //     <form onSubmit={handleSubmit}>
    //       <input
    //         type="email"
    //         placeholder="Admin Email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //       />
    //       <input
    //         type="password"
    //         placeholder="Password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //       />
    //       <button type="submit">Login as Admin</button>
    //     </form>
    //     {error && <p style={{ color: 'red' }}>{error}</p>}
    //     <p>
    //       <Link to="/login">Regular Login</Link> | <Link to="/forgot">Forgot Password?</Link>
    //     </p>
    //   </div>

    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden mb-9">
      <div className="w-full p-6 m-auto rounded-md shadow-md lg:max-w-md bg-base-100">
        <h1 className="text-3xl font-semibold text-center text-primary">
          Admin Login
        </h1>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="label">
              <span className="label-text">Admin Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter admin email"
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
              placeholder="Enter password"
              className="w-full input input-bordered input-primary"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mt-6">
            <button type="submit" className="w-full btn btn-primary">
              Login as Admin
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-3 text-sm text-center text-red-500">{error}</p>
        )}


        <p className="mt-8 text-xs font-light text-center text-primary">
          <Link to="/login" className="font-medium text-primary hover:underline">
            Regular Login
          </Link>{" "}
          |{" "}
          <Link
            to="/forgot"
            className="font-medium text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;