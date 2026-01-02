import React from 'react';
import { Loader2 } from 'lucide-react';
import { useThemeColors } from '../../AdminContext';

const Loading = ({
  size = 'medium',
  text = 'Loading...',
  className = '',
  ...props
}) => {
  const colors = useThemeColors();

  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      <Loader2 className={`animate-spin mr-2 ${sizes[size]}`} style={{ color: colors.accent }} />
      {text && <span style={{ color: colors.textSecondary }}>{text}</span>}
    </div>
  );
};

export default Loading;