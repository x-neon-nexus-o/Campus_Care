import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
    // Client-side redirect to login page
    navigate('/login');
  };

  // Session Timeout Logic
  useEffect(() => {
    if (!user) return;

    let timeout;
    const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
        alert('Session timed out due to inactivity');
      }, TIMEOUT_MS);
    };

    const activities = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activities.forEach(ev => window.addEventListener(ev, resetTimer));

    resetTimer(); // Start timer

    return () => {
      activities.forEach(ev => window.removeEventListener(ev, resetTimer));
      clearTimeout(timeout);
    };
  }, [user]);

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
