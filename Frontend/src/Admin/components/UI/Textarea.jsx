import React from 'react';
import { useThemeColors } from '../../AdminContext';

const Textarea = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  rows = 4,
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
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 resize-vertical ${error ? 'border-red-500' : ''} ${className}`}
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

export default Textarea;