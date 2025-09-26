import { useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter an email');
      return;
    }
    try {
      const res = await api.post('/auth/forgot', { email });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset email');
      setMessage('');
    }
  };

  return (
    // <div data-theme="retro" className=''>
    //   <h2>Forgot Password</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="email"
    //       placeholder="Email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //     <button type="submit">Send Reset Link</button>
    //   </form>
    //   {message && <p style={{ color: 'green' }}>{message}</p>}
    //   {error && <p style={{ color: 'red' }}>{error}</p>}
    //   <p>
    //     <Link to="/login">Back to Login</Link>
    //   </p>
    // </div>

    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden mb-9">
      <div className="w-full p-6 m-auto rounded-md shadow-md lg:max-w-md bg-base-100">
        <h1 className="text-3xl font-semibold text-center text-primary">
          Forgot Password
        </h1>

        <form className="mt-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full input input-bordered input-primary"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Reset Button */}
          <div className="mt-6">
            <button type="submit" className="w-full btn btn-primary">
              Send Reset Link
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && <p className="mt-3 text-sm text-center text-red-500">{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}

        {/* Back to Login */}
        <p className="mt-8 text-xs font-light text-center text-primary">
          Remember your password?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
    
  );
}

export default ForgotPassword;