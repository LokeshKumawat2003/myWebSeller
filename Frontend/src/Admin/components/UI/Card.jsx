import React from 'react';
import { useThemeColors } from '../../AdminContext';

const Card = ({
  children,
  className = '',
  padding = 'p-6',
  shadow = 'shadow-sm',
  ...props
}) => {
  const colors = useThemeColors();

  return (
    <div
      className={`rounded-xl ${shadow} ${padding} ${className}`}
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;