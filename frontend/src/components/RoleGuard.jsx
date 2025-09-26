import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleGuard = ({ children, requiredRole, userRole, fallbackPath = "/login" }) => {
  const { isAuthenticated, user } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Check if user has the required role
  const currentUserRole = userRole || user?.role;
  if (currentUserRole !== requiredRole) {
    // Redirect based on user role
    if (currentUserRole === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (currentUserRole === 'head') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (currentUserRole === 'faculty') {
      return <Navigate to="/track-complaints" replace />;
    } else {
      return <Navigate to="/track-complaints" replace />;
    }
  }

  return children;
};

export default RoleGuard;
