import { useState } from 'react';
import api from '../utils/api';

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
      const res = await api.post('/forgot', { email });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset email');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        <a href="/login">Back to Login</a>
      </p>
    </div>
  );
}

export default ForgotPassword;