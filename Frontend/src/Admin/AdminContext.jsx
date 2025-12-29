import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuthToken, setAuthToken, clearAuthToken } from '../services/api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (token, adminData) => {
    setAuthToken(token);
    setAdmin(adminData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuthToken();
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const updateAdmin = (data) => {
    setAdmin(data);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, isAuthenticated, login, logout, updateAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
