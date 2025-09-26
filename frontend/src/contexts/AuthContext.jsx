import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { clearUserSession, setUserSession, getUserSession, isSessionValid, refreshUserData } from '../utils/sessionManager';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getUserSession();
    if (session && isSessionValid()) {
      // Set up API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
      setUser(session.user);
      setLoading(false);
      
      // Refresh user data to ensure it's current
      refreshUserData(api).then(userData => {
        if (userData) {
          setUser(userData);
        }
      });
    } else {
      // Clear invalid session
      clearUserSession();
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Clear any existing session first
      clearUserSession();
      
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      // Set up new session
      setUserSession(userData, token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      // Clear session on login failure
      clearUserSession();
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    // Clear all session data
    clearUserSession();
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    // Redirect to login page after logout
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
