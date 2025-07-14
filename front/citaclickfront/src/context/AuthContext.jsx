import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  // Login manual
  const login = (userData) => {
    setAuth({ isAuthenticated: true, user: userData });
    localStorage.setItem('access_token', userData.token);
  };

  // Logout
  const logout = () => {
    setAuth({ isAuthenticated: false, user: null });
    localStorage.removeItem('access_token');
  };

  // Login automático al montar la app
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAuth({ isAuthenticated: true, user: { token } });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
