import React from 'react';
import { useThemeColors } from '../../AdminContext';

const Checkbox = ({
  label,
  checked,
  onChange,
  className = '',
  ...props
}) => {
  const colors = useThemeColors();

  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 focus:ring-2 rounded"
        style={{
          accentColor: colors.accent,
        }}
        {...props}
      />
      {label && <span style={{ color: colors.textPrimary }}>{label}</span>}
    </label>
  );
};

export default Checkbox;