import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Main from "./components/Hero.jsx";
import Footer from "./components/Footer.jsx";
import SubmitComplaint from "./pages/SubmitComplaint.jsx";
import ComplaintTracker from "./pages/ComplaintTracker.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import FAQ from "./pages/FAQ.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import RoleGuard from "./components/RoleGuard.jsx";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="container p-4 mx-auto ">
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/submit-complaint" element={<SubmitComplaint />} />
          <Route path="/track-complaints" element={<ComplaintTracker />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/student-dashboard"
            element={<Dashboard role="student" />}
          />
          <Route
            path="/admin-dashboard"
            element={
              <RoleGuard requiredRole="admin">
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/faculty-dashboard"
            element={<Dashboard role="faculty" />}
          />
          {/* Catch-all route for 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <p className="text-xl mb-4">Page not found</p>
                <Link to="/" className="btn btn-primary">Go Home</Link>
              </div>
            </div>
          } />
        </Routes>

        <Footer></Footer>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
