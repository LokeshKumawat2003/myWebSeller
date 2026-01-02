import React from 'react';
import { useThemeColors } from '../../AdminContext';

const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  error,
  className = '',
  ...props
}) => {
  const colors = useThemeColors();

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500' : ''} ${className}`}
        style={{
          backgroundColor: colors.bgSecondary,
          color: colors.textPrimary,
          borderColor: colors.border,
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;