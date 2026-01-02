import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuthToken, setAuthToken, clearAuthToken } from '../services/api';

// Predefined color themes
const colorThemes = {
  luxury: {
    bg: '#fbf7f2',
    bgSecondary: '#f0ede6',
    border: '#d4c4b0',
    text: '#3b3b3b',
    textPrimary: '#3b3b3b',
    textSecondary: '#666',
    accent: '#9c7c3a',
    accentLight: '#b8914a',
  },
  dark: {
    bg: '#1a1a1a',
    bgSecondary: '#2a2a2a',
    border: '#404040',
    text: '#ffffff',
    textPrimary: '#ffffff',
    textSecondary: '#cccccc',
    accent: '#60a5fa',
    accentLight: '#93c5fd',
  },
  blue: {
    bg: '#f0f9ff',
    bgSecondary: '#e0f2fe',
    border: '#bae6fd',
    text: '#0c4a6e',
    textPrimary: '#0c4a6e',
    textSecondary: '#0369a1',
    accent: '#0284c7',
    accentLight: '#38bdf8',
  },
  green: {
    bg: '#f0fdf4',
    bgSecondary: '#dcfce7',
    border: '#bbf7d0',
    text: '#14532d',
    textPrimary: '#14532d',
    textSecondary: '#166534',
    accent: '#16a34a',
    accentLight: '#4ade80',
  },
  purple: {
    bg: '#faf5ff',
    bgSecondary: '#f3e8ff',
    border: '#d8b4fe',
    text: '#581c87',
    textPrimary: '#581c87',
    textSecondary: '#7c3aed',
    accent: '#9333ea',
    accentLight: '#c084fc',
  },
  red: {
    bg: '#fef2f2',
    bgSecondary: '#fee2e2',
    border: '#fecaca',
    text: '#991b1b',
    textPrimary: '#991b1b',
    textSecondary: '#dc2626',
    accent: '#dc2626',
    accentLight: '#f87171',
  },
};

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('luxury');
  const [customColors, setCustomColors] = useState(null);

  // Get current theme colors (custom or predefined)
  const getCurrentColors = () => {
    return customColors || colorThemes[currentTheme];
  };

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    const savedCustomColors = localStorage.getItem('adminCustomColors');

    if (savedTheme && colorThemes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }

    if (savedCustomColors) {
      try {
        setCustomColors(JSON.parse(savedCustomColors));
      } catch (e) {
        console.error('Error parsing saved custom colors:', e);
      }
    }

    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

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

  // Theme management functions
  const changeTheme = (themeName) => {
    if (colorThemes[themeName]) {
      setCurrentTheme(themeName);
      setCustomColors(null);
      localStorage.setItem('adminTheme', themeName);
      localStorage.removeItem('adminCustomColors');
    }
  };

  const setCustomTheme = (colors) => {
    setCustomColors(colors);
    localStorage.setItem('adminCustomColors', JSON.stringify(colors));
  };

  const resetToDefaultTheme = () => {
    setCurrentTheme('luxury');
    setCustomColors(null);
    localStorage.setItem('adminTheme', 'luxury');
    localStorage.removeItem('adminCustomColors');
  };

  return (
    <AdminContext.Provider value={{
      admin,
      loading,
      isAuthenticated,
      login,
      logout,
      updateAdmin,
      // Theme related
      currentTheme,
      customColors,
      getCurrentColors,
      colorThemes,
      changeTheme,
      setCustomTheme,
      resetToDefaultTheme
    }}>
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

// Hook for easy access to theme colors
export const useThemeColors = () => {
  const { getCurrentColors } = useAdmin();
  return getCurrentColors();
};
