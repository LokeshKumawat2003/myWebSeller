import React, { useState, useCallback, useContext, createContext } from 'react';
import Toast from './Toast';

// Create Toast Context
export const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    (message, options = {}) => {
      const {
        type = 'info',
        title = '',
        duration = 5000,
        id = Date.now() + Math.random(),
      } = options;

      const newToast = { id, type, message, title, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, title = 'Success', duration = 5000) => {
      addToast(message, { type: 'success', title, duration });
    },
    [addToast]
  );

  const showError = useCallback(
    (message, title = 'Error', duration = 5000) => {
      addToast(message, { type: 'error', title, duration });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message, title = 'Warning', duration = 5000) => {
      addToast(message, { type: 'warning', title, duration });
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message, title = 'Info', duration = 5000) => {
      addToast(message, { type: 'info', title, duration });
    },
    [addToast]
  );

  const value = {
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    toasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            type={toast.type}
            message={toast.message}
            title={toast.title}
            duration={toast.duration}
            onClose={onRemove}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
