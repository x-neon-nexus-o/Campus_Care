import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }
    try {
      const res = await api.post('/reset', { token, newPassword });
      setMessage(res.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
      setMessage('');
    }
  };

  return (
    // <div data-theme="retro" className=''>
    //   <h2>Reset Password</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="password"
    //       placeholder="New Password"
    //       value={newPassword}
    //       onChange={(e) => setNewPassword(e.target.value)}
    //     />
    //     <button type="submit">Reset</button>
    //   </form>
    //   {message && <p style={{ color: 'green' }}>{message}</p>}
    //   {error && <p style={{ color: 'red' }}>{error}</p>}
    // </div>

     <div className="relative flex flex-col justify-center min-h-screen overflow-hidden mb-9">
      <div className="w-full p-6 m-auto rounded-md shadow-md lg:max-w-md bg-base-100">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-center text-primary">
          Reset Password
        </h1>

        <form className="mt-6" onSubmit={handleSubmit}>
          {/* New Password Input */}
          <div>
            <label className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your new password"
              className="w-full input input-bordered input-primary"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button type="submit" className="w-full btn btn-primary">
              Reset
            </button>
          </div>
        </form>

        {/* Feedback Messages */}
        {message && (
          <p className="mt-3 text-sm text-center text-green-600">{message}</p>
        )}
        {error && (
          <p className="mt-3 text-sm text-center text-red-500">{error}</p>
        )}

        {/* Back to Login */}
        <p className="mt-8 text-xs font-light text-center text-primary">
          Remembered your password?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;