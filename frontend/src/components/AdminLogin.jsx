import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const res = await api.post('/admin-login', { email, password });
      localStorage.setItem('token', res.data.token);
      if (res.data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        setError('Unauthorized: Not an admin account');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login as Admin</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        <a href="/login">Regular Login</a> | <a href="/forgot">Forgot Password?</a>
      </p>
    </div>
  );
}

export default AdminLogin;