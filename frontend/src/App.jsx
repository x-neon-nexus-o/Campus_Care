import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import Register from './components/Register.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/student-dashboard" element={<Dashboard role="student" />} />
        <Route path="/admin-dashboard" element={<Dashboard role="admin" />} />
        <Route path="/faculty-dashboard" element={<Dashboard role="faculty" />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;