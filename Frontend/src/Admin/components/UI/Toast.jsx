import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ id, type = 'info', message, title, duration = 5000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const types = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-500',
      titleColor: 'text-green-900',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-500',
      titleColor: 'text-yellow-900',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      iconColor: 'text-red-500',
      titleColor: 'text-red-900',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-900',
    },
  };

  const config = types[type];
  const IconComponent = config.icon;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 shadow-lg animate-in fade-in slide-in-from-right-5 duration-300 max-w-sm w-full`}
      role="alert"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 pt-0.5">
          <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          {title && <h3 className={`font-semibold ${config.titleColor} mb-1`}>{title}</h3>}
          <p className={`text-sm ${config.textColor}`}>{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className={`flex-shrink-0 ${config.textColor} hover:opacity-75 transition-opacity`}
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
