import React from 'react';
import { useThemeColors } from '../../AdminContext';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium'
}) => {
  const colors = useThemeColors();

  if (!isOpen) return null;

  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className={`relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 w-full ${sizes[size]}`} style={{ backgroundColor: colors.bg }}>
          {title && (
            <div className="px-6 py-4" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border, borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
              <h3 className="text-lg font-medium" style={{ color: colors.textPrimary }} id="modal-title">{title}</h3>
            </div>
          )}

          <div className="px-6 py-4">
            {children}
          </div>

          {footer && (
            <div className="px-6 py-4 flex justify-end space-x-3" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border, borderTopWidth: '1px', borderTopStyle: 'solid' }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;