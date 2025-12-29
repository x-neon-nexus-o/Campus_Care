import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import RoleGuard from "./components/RoleGuard.jsx";
import LoadingSkeleton from "./components/LoadingSkeleton.jsx"; // We will create this

// Lazy load pages
const Login = lazy(() => import("./pages/Login.jsx"));
const AdminLogin = lazy(() => import("./pages/AdminLogin.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Main = lazy(() => import("./components/Hero.jsx"));
const SubmitComplaint = lazy(() => import("./pages/SubmitComplaint.jsx"));
const ComplaintTracker = lazy(() => import("./pages/ComplaintTracker.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const FAQ = lazy(() => import("./pages/FAQ.jsx"));

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="container p-4 mx-auto ">
      <Navbar></Navbar>
      <Suspense fallback={<LoadingSkeleton />}>
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
      </Suspense>

      <Footer></Footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
