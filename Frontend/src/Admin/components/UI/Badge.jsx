import React from 'react';
import { useThemeColors } from '../../AdminContext';

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
  ...props
}) => {
  const colors = useThemeColors();

  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: colors.bgSecondary,
          color: colors.textPrimary
        };
      case 'primary':
        return {
          backgroundColor: colors.accent,
          color: 'white'
        };
      case 'secondary':
        return {
          backgroundColor: colors.bg,
          color: colors.textSecondary
        };
      case 'success':
        return {
          backgroundColor: '#dcfce7',
          color: '#166534'
        };
      case 'warning':
        return {
          backgroundColor: '#fef3c7',
          color: '#92400e'
        };
      case 'danger':
        return {
          backgroundColor: '#fee2e2',
          color: '#991b1b'
        };
      default:
        return {
          backgroundColor: colors.bgSecondary,
          color: colors.textPrimary
        };
    }
  };

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-0.5 text-sm',
    large: 'px-3 py-1 text-base',
  };

  const classes = `inline-flex items-center rounded-full font-medium ${sizes[size]} ${className}`;

  return (
    <span className={classes} style={getVariantStyles()} {...props}>
      {children}
    </span>
  );
};

export default Badge;