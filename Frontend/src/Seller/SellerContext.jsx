import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuthToken, setAuthToken, clearAuthToken, getSellerProfile } from '../services/api';

const SellerContext = createContext();

export const SellerProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
      // Try to populate seller profile when token is present
      (async () => {
        try {
          const s = await getSellerProfile(token);
          if (s) setSeller(s);
        } catch (err) {
          // ignore — user may not have a seller profile yet
        }
      })();
    }
    setLoading(false);
  }, []);

  const login = (token, sellerData) => {
    setAuthToken(token);
    setSeller(sellerData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuthToken();
    setSeller(null);
    setIsAuthenticated(false);
  };

  const updateSeller = (data) => {
    setSeller(data);
  };

  return (
    <SellerContext.Provider value={{ seller, loading, isAuthenticated, login, logout, updateSeller }}>
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSeller must be used within SellerProvider');
  }
  return context;
};
