import React from 'react';
import { useThemeColors } from '../../AdminContext';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const colors = useThemeColors();

  return (
    <div className="mb-4">
      {label && (
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: colors.textPrimary }}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500' : ''} ${className}`}
        style={{
          backgroundColor: colors.bg,
          border: `1px solid ${colors.border}`,
          color: colors.textPrimary,
          '--tw-ring-color': colors.accent
        }}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;