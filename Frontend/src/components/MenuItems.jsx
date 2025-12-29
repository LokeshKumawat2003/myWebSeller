import React from 'react';
import MenuItem from './MenuItem';

const MenuItems = ({
  menuItems,
  notifications,
  activeItem,
  isCollapsed,
  onMenuItemClick,
  isDark,
  isLuxury
}) => {
  return (
    <div className="space-y-1">
      {menuItems.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          isActive={activeItem === item.id}
          isCollapsed={isCollapsed}
          hasNotification={notifications[item.id] > 0}
          notificationCount={notifications[item.id]}
          onClick={onMenuItemClick}
          isDark={isDark}
          isLuxury={isLuxury}
        />
      ))}
    </div>
  );
};

export default MenuItems;