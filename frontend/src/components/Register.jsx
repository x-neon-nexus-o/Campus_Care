import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div>
      <h2>Register (Students Only)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email (@famt.ac.in)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        <a href="/login">Back to Login</a>
      </p>
    </div>
  );
}

export default Register;