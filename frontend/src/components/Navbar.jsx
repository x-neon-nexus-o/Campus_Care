import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div>
       <div className="mb-3 rounded-md navbar bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li><Link to="/submit-complaint">Submit a Complaint</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/track-complaints">Track Status</Link></li>
            {user?.role === 'admin' && <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>}
            <li><button onClick={logout} className='me-1'>Logout</button></li>
          </>
        ) : (
          <li>
            <a>Login</a>
            <ul className="p-2">
               <li><Link to="/login">Student Login</Link></li>
              <li><Link to="/admin-login">Admin Login</Link></li>
            </ul>
          </li>
        )}
      </ul>
    </div>
    

    <Link to="/" className="href">
        <img 
          className='w-32 ml-3' 
          src="/imgs/CompanyLogo.png"
          alt="FAMT College Logo"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
    </Link>
    
  </div>
  
  <div className="hidden navbar-center lg:flex">
    <ul className="px-1 menu menu-horizontal">
      <li><Link to="/submit-complaint">Submit a Complaint</Link></li>
      {isAuthenticated ? (
        <>
          <li><Link to="/track-complaints">Track Status</Link></li>
          {user?.role === 'admin' && <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>}
        </>
      ) : (
        <li>
          <details>
            <summary>Login</summary>
            <ul className="bg-[#333333] menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 p-3 shadow">
              <li><Link to="/login">Student Login</Link></li>
              <li><Link to="/admin-login">Admin Login</Link></li>
            </ul>
          </details>
        </li>
      )}
    </ul>
  </div>
  <div className="navbar-end">
    {isAuthenticated && (
      <div className="flex items-center space-x-4">
        <span className="text-sm">Welcome, {user?.email}</span>
        <button onClick={logout} className="btn btn-outline btn-sm me-2">Logout</button>
      </div>
    )}
    
    <label className="grid cursor-pointer place-items-center">
  <input
    type="checkbox"
    value="dim"
    className="col-span-2 col-start-1 row-start-1 toggle theme-controller bg-base-content" />
  <svg
    className="col-start-1 row-start-1 stroke-base-100 fill-base-100"
    xmlns="http://www.w.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <path
      d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </svg>
  <svg
    className="col-start-2 row-start-1 stroke-base-100 fill-base-100"
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
</label>
  </div>
</div>
    </div>
  )
}

export default Navbar
