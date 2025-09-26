// Session management utilities to ensure proper data isolation

export const clearUserSession = () => {
  // Clear all user-related data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('complaints');
  localStorage.removeItem('adminData');
  
  // Clear any cached data
  if (window.caches) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
};

export const setUserSession = (userData, token) => {
  // Set user session data
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Clear any previous user's data
  localStorage.removeItem('complaints');
  localStorage.removeItem('adminData');
};

export const getUserSession = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return null;
  }
  
  try {
    const user = JSON.parse(userStr);
    return { user, token };
  } catch (error) {
    console.error('Error parsing user session:', error);
    clearUserSession();
    return null;
  }
};

export const isSessionValid = () => {
  const session = getUserSession();
  if (!session) return false;
  
  // Check if token is expired (basic check)
  try {
    const token = session.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp > now;
  } catch (error) {
    console.error('Error validating session:', error);
    clearUserSession();
    return false;
  }
};

export const refreshUserData = async (api) => {
  try {
    const response = await api.get('/auth/profile');
    const userData = response.data;
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    clearUserSession();
    return null;
  }
};
