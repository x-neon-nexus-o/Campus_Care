import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Main() {
  const { isAuthenticated } = useAuth();

  const handleLodgeComplaint = () => {
    if (isAuthenticated) {
      window.location.href = '/submit-complaint';
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div>
      <div
        className="min-h-screen mb-3 hero" 
        style={{
          backgroundImage: "url(/imgs/4927041.jpg)",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="text-center hero-content text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-6 text-3xl font-bold">Speak Up, We'll Take It Forward</h1>
            <p className="mb-5">
              A secure digital system designed for students to file complaints, monitor progress, and hold departments accountable.
            </p>
            <button 
              className="btn btn-primary"
              onClick={handleLodgeComplaint}
            >
              Lodge a Complaint
            </button>
            <div className="mt-4">
              <Link to="/track-complaints" className="btn btn-outline btn-sm mr-2">
                Track Status
              </Link>
              <Link to="/faq" className="btn btn-outline btn-sm">
                FAQ & Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
