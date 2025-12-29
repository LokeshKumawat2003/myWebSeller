import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import MenuItems from './MenuItems';

const SharedSidebar = ({
  menuItems,
  activeTab,
  setActiveTab,
  user,
  logout,
  logoutPath,
  theme = 'light',
  logoIcon: LogoIcon,
  logoTitle = 'AgriMart',
  logoSubtitle,
  notifications = {}
}) => {

  // Early return for debugging
  if (!menuItems || menuItems.length === 0) {
    console.log('SharedSidebar: No menu items provided');
    return <div className="w-64 bg-gray-100 p-4 text-center text-gray-600">No menu items available</div>;
  }

  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(logoutPath);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isDark = theme === 'dark';
  const isLuxury = theme === 'luxury';

  // Enhanced styling with better gradients and effects
  const bgClass = isDark
    ? 'bg-gradient-to-b from-slate-900 via-gray-900 to-slate-900'
    : isLuxury
    ? 'bg-gradient-to-b from-[#fbf7f2] via-[#f5f0e8] to-[#ede6d6]'
    : 'bg-gradient-to-b from-white via-slate-50 to-gray-50';
  const borderClass = isDark ? 'border-slate-700' : isLuxury ? 'border-[#e6ddd2]' : 'border-slate-200';
  const textClass = isDark ? 'text-white' : isLuxury ? 'text-[#3b3b3b]' : 'text-gray-900';
  const textSecondaryClass = isDark ? 'text-slate-400' : isLuxury ? 'text-[#666]' : 'text-slate-500';
  const hoverClass = isDark ? 'hover:bg-slate-800/80 hover:shadow-lg' : isLuxury ? 'hover:bg-[#e6ddd2]/80 hover:shadow-md' : 'hover:bg-slate-100/80 hover:shadow-md';
  const activeClass = isDark
    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-l-4 border-blue-400 text-blue-200 shadow-lg shadow-blue-500/10'
    : isLuxury
    ? 'bg-gradient-to-r from-[#9c7c3a]/20 to-[#b8914a]/20 border-l-4 border-[#9c7c3a] text-[#9c7c3a] shadow-lg shadow-[#9c7c3a]/10'
    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 text-blue-800 shadow-lg shadow-blue-500/10';
  const logoutClass = isDark
    ? 'bg-red-900/40 text-red-300 hover:bg-red-800/60 hover:text-red-200 border border-red-700/50'
    : isLuxury
    ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200'
    : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200';

  return (
    <aside className={`${isCollapsed ? 'w-16' : 'w-64'} ${bgClass} border-r ${borderClass} shadow-xl flex flex-col h-screen transition-all duration-300 ease-in-out`}>
      {/* Header with enhanced styling */}
      <div className={`p-4 border-b ${borderClass} ${isDark ? 'bg-slate-800/60 backdrop-blur-sm' : isLuxury ? 'bg-[#fbf7f2]/90 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} flex items-center justify-between shadow-sm`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : isLuxury ? 'bg-gradient-to-r from-[#9c7c3a] to-[#b8914a]' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200`}>
              <LogoIcon size={20} className="text-white drop-shadow-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className={`text-lg font-bold ${textClass} truncate drop-shadow-sm font-serif`}>
                {logoTitle}
              </h1>
              <p className={`text-xs ${textSecondaryClass} truncate font-medium font-sans`}>
                {logoSubtitle}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className={`p-2 rounded-lg ${hoverClass} transition-all duration-200 hover:scale-110 ${isCollapsed ? 'mx-auto' : ''} group`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight size={18} className={`${textClass} group-hover:text-blue-400 transition-colors`} />
          ) : (
            <ChevronLeft size={18} className={`${textClass} group-hover:text-blue-400 transition-colors`} />
          )}
        </button>
      </div>

      {/* Navigation with enhanced menu items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <MenuItems
          menuItems={menuItems}
          notifications={notifications}
          activeItem={activeTab}
          isCollapsed={isCollapsed}
          onMenuItemClick={setActiveTab}
          isDark={isDark}
          isLuxury={isLuxury}
        />
      </nav>

      {/* User Profile Section with enhanced styling */}
      <div className={`p-4 border-t ${borderClass} ${isDark ? 'bg-slate-800/60 backdrop-blur-sm' : isLuxury ? 'bg-[#fbf7f2]/90 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
        {!isCollapsed ? (
          <>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${hoverClass} cursor-pointer transition-all duration-200 group mb-3 shadow-sm`}>
              <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : isLuxury ? 'bg-gradient-to-r from-[#9c7c3a] to-[#b8914a]' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} flex items-center justify-center text-white font-semibold shadow-lg transform group-hover:scale-105 transition-transform duration-200`}>
                <UserCircle size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${textClass} truncate drop-shadow-sm`}>{user?.name || 'User'}</p>
                <p className={`text-xs ${textSecondaryClass} truncate font-medium`}>{user?.email || 'user@agrimart.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`w-full px-4 py-2.5 rounded-xl ${logoutClass} transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transform`}
            >
              <LogOut size={16} className="drop-shadow-sm" />
              Logout
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : isLuxury ? 'bg-gradient-to-r from-[#9c7c3a] to-[#b8914a]' : 'bg-gradient-to-r from-blue-500 to-indigo-500'} flex items-center justify-center text-white font-bold shadow-xl cursor-pointer transition-transform hover:scale-110`} title={`${user?.name || 'User'} - ${user?.email || 'user@agrimart.com'}`}>
              <UserCircle size={24} />
            </div>
            <button
              onClick={handleLogout}
              className={`p-3 rounded-xl ${logoutClass} transition-all duration-200 hover:scale-110 shadow-lg`}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SharedSidebar;