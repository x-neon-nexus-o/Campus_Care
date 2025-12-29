import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api'; // Assuming you have an api instance configured
import { toast } from 'react-toastify'; // Assuming you have react-toastify installed and configured

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpToken, setTotpToken] = useState(''); // 2FA code
  const [show2FA, setShow2FA] = useState(false);  // Toggle 2FA input
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Keeping this for potential future use or if context login is modified

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!show2FA && (!email || !password)) {
      setError('Please fill in all fields');
      return;
    }
    if (show2FA && !totpToken) {
      setError('Please enter your 2FA code');
      return;
    }

    // For admin, use the specific admin-login endpoint
    // We can't use the generic context login for the FIRST step effectively if it doesn't support 2FA flow yet,
    // so we call API directly or modify context. For simplicity, we call API here.
    try {
      // First try login (pass totpToken if we have it)
      const res = await api.post('/auth/admin-login', { email, password, totpToken });

      if (res.data.require2FA) {
        setShow2FA(true);
        toast.info('Please enter your 2FA code');
        return;
      }

      // If success (token received)
      if (res.data.token) {
        // We use a custom method or just force state update if context exposes it,
        // but cleaner is to let context handle "set user".
        // Re-using login() from context might duplicate the API call.
        // Let's assume we just store token and redirect, or manually update context state.
        // Ideally, context.login should accept a token/user object to "hydrate" session.
        // Since useAuth.login does an API call, we might need a `setAuth(token, user)` method.
        // For now, let's just use the context login which hits /auth/login, but that's for generic users.
        // Correction: Admin login is separate. We should just save to localStorage and reload/redirect
        // OR add `adminLogin` to AuthContext.

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        // Force reload or better, have context listen to storage, but simplest for now:
        window.location.href = '/admin-dashboard';
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      setError(err.response?.data?.message || 'Admin login failed'); // Also set local error state
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
        <h2 className="text-2xl font-bold text-center text-primary">Admin Portal</h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          {!show2FA ? (
            <>
              <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Password</span></label>
                <input
                  type="password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <div className="form-control">
              <label className="label"><span className="label-text">2FA Code (Authenticator)</span></label>
              <input
                type="text"
                className="input input-bordered text-center tracking-widest text-xl"
                placeholder="000 000"
                value={totpToken}
                onChange={(e) => setTotpToken(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">{show2FA ? 'Verify 2FA' : 'Login'}</button>
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