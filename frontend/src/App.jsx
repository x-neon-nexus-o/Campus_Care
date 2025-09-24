import { BrowserRouter as Router,Route,Routes,} from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Main from "./components/Hero.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/admin-login" element={<AdminLogin />} />
    //     <Route path="/register" element={<Register />} />
    //     <Route path="/forgot" element={<ForgotPassword />} />
    //     <Route path="/reset/:token" element={<ResetPassword />} />
    //     <Route path="/student-dashboard" element={<Dashboard role="student" />} />
    //     <Route path="/admin-dashboard" element={<Dashboard role="admin" />} />
    //     <Route path="/faculty-dashboard" element={<Dashboard role="faculty" />} />
    //     <Route path="/" element={<Login />} />
    //   </Routes>
    // </Router>

    <>
      <Router>
        <div className="container p-4 mx-auto ">
          <Navbar></Navbar>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Main></Main>
                </>
              }
            ></Route>
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route
              path="/student-dashboard"
              element={<Dashboard role="student" />}
            />
            <Route
              path="/admin-dashboard"
              element={<Dashboard role="admin" />}
            />
            <Route
              path="/faculty-dashboard"
              element={<Dashboard role="faculty" />}
            />

          </Routes>

          <Footer></Footer>
        </div>
      </Router>
    </>
  );
}

export default App;
