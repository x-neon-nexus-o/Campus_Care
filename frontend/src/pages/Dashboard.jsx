import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Dashboard({ role }) {
  const { user, logout } = useAuth();

  const getDashboardContent = () => {
    switch (role) {
      case 'student':
        return {
          title: 'Student Dashboard',
          description: 'Track your complaints and submit new ones',
          actions: [
            { label: 'Submit New Complaint', path: '/submit-complaint', icon: '📝' },
            { label: 'Track My Complaints', path: '/track-complaints', icon: '📊' },
            { label: 'FAQ & Help', path: '/faq', icon: '❓' }
          ]
        };
      case 'faculty':
        return {
          title: 'Faculty Dashboard',
          description: 'Manage complaints assigned to your department',
          actions: [
            { label: 'View Department Complaints', path: '/track-complaints', icon: '📋' },
            { label: 'Update Complaint Status', path: '/track-complaints', icon: '✏️' },
            { label: 'FAQ & Help', path: '/faq', icon: '❓' }
          ]
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to your dashboard',
          actions: [
            { label: 'Submit Complaint', path: '/submit-complaint', icon: '📝' },
            { label: 'Track Complaints', path: '/track-complaints', icon: '📊' }
          ]
        };
    }
  };

  const content = getDashboardContent();

  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">{content.title}</h1>
          <p className="text-lg text-base-content/70">{content.description}</p>
          {user && (
            <p className="text-sm text-base-content/50 mt-2">
              Welcome, {user.email} ({user.role})
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {content.actions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="card-body text-center">
                <div className="text-4xl mb-2">{action.icon}</div>
                <h3 className="card-title justify-center text-lg">{action.label}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat bg-primary text-primary-content rounded-lg">
            <div className="stat-figure text-primary-content">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title text-primary-content">Total Complaints</div>
            <div className="stat-value text-primary-content">--</div>
            <div className="stat-desc text-primary-content/70">All time</div>
          </div>

          <div className="stat bg-secondary text-secondary-content rounded-lg">
            <div className="stat-figure text-secondary-content">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title text-secondary-content">Pending</div>
            <div className="stat-value text-secondary-content">--</div>
            <div className="stat-desc text-secondary-content/70">Awaiting response</div>
          </div>

          <div className="stat bg-accent text-accent-content rounded-lg">
            <div className="stat-figure text-accent-content">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
              </svg>
            </div>
            <div className="stat-title text-accent-content">Resolved</div>
            <div className="stat-value text-accent-content">--</div>
            <div className="stat-desc text-accent-content/70">This month</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Recent Activity</h2>
            <div className="text-center py-8 text-base-content/50">
              <p>No recent activity to display</p>
              <p className="text-sm mt-2">Your complaint activities will appear here</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button onClick={logout} className="btn btn-outline btn-error">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;