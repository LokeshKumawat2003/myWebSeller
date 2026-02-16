import React, { useState } from 'react';
import { useSeller } from './SellerContext';
import { Menu, LogOut, Store, User, Bell, CheckCircle, Clock, XCircle, X } from 'lucide-react';
import Logo from '../components/Logo';

export default function SellerNavbar({ seller, onMenuClick }) {
  const { logout } = useSeller();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getStatusInfo = () => {
    if (!seller) return { color: 'bg-[#e6ddd2] text-[#666]', icon: Clock, text: 'Loading...' };

    if (seller.blocked) {
      return { color: 'bg-[#e6ddd2] text-[#3b3b3b]', icon: XCircle, text: 'Blocked' };
    } else if (seller.approved) {
      return { color: 'bg-[#9c7c3a] text-white', icon: CheckCircle, text: 'Approved' };
    } else {
      return { color: 'bg-[#fbf7f2] text-[#666] border border-[#e6ddd2]', icon: Clock, text: 'Pending' };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-[#fbf7f2] shadow-sm border-b border-[#e6ddd2] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">

            {/* Left Section - Logo and Store Info */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 text-[#3b3b3b] hover:bg-[#e6ddd2] rounded-lg transition-colors duration-200"
                aria-label="Open sidebar menu"
              >
                <Menu size={20} />
              </button>

              {/* Store Logo */}
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#e6ddd2] rounded-xl flex items-center justify-center shadow-sm">
                <Logo size="sm" />
              </div>

              {/* Store Info - Hidden on mobile, visible on larger screens */}
              <div className="hidden sm:block">
                <h1 className="text-lg lg:text-xl font-light italic text-[#3b3b3b] font-serif">
                  {seller?.storeName || 'Seller Dashboard'}
                </h1>
                <div className="flex items-center gap-2 text-sm text-[#666] font-sans">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-[200px]">{seller?.user?.email || 'seller@kalaqx.com'}</span>
                </div>
              </div>
            </div>

            {/* Center Section - Status Badge (Desktop Only) */}
            <div className="hidden md:flex items-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-light italic ${statusInfo.color} font-serif shadow-sm`}>
                <StatusIcon className="w-4 h-4" />
                <span>{statusInfo.text}</span>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-[#3b3b3b] hover:bg-[#e6ddd2] rounded-lg transition-colors duration-200 group">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#9c7c3a] rounded-full flex items-center justify-center">
                  <span className="sr-only">Notifications</span>
                </span>
                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-[#3b3b3b] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap font-sans">
                  Notifications
                </div>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="sm:hidden p-2 text-[#3b3b3b] hover:bg-[#e6ddd2] rounded-lg transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <User size={20} />}
              </button>

              {/* Desktop Logout */}
              <div
                onClick={logout}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#9c7c3a] to-[#8a6a2f] hover:from-[#8a6a2f] hover:to-[#7a5c1f] text-white rounded-lg text-sm font-light italic transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-[#9c7c3a]/25 border border-[#9c7c3a]/20 hover:border-[#9c7c3a]/40 font-serif group"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                <span>Logout</span>
              </div>

              {/* Desktop User Avatar */}
              <div className="hidden sm:flex w-10 h-10 bg-[#e6ddd2] rounded-full items-center justify-center shadow-sm">
                <Store className="w-5 h-5 text-[#9c7c3a]" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Status Bar */}
        <div className="md:hidden border-t border-[#e6ddd2] bg-[#f9f6f0]">
          <div className="px-4 py-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-light italic ${statusInfo.color} font-serif`}>
              <StatusIcon className="w-3 h-3" />
              <span>{statusInfo.text}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed top-16 left-0 right-0 bg-[#fbf7f2] border-b border-[#e6ddd2] shadow-lg z-40">
          <div className="px-4 py-4 space-y-4">
            {/* Store Info */}
            <div className="border-b border-[#e6ddd2] pb-4">
              <h2 className="text-lg font-light italic text-[#3b3b3b] font-serif mb-1">
                {seller?.storeName || 'Seller Dashboard'}
              </h2>
              <p className="text-sm text-[#666] flex items-center gap-2 font-sans">
                <User className="w-4 h-4" />
                {seller?.user?.email || 'seller@kalaqx.com'}
              </p>
            </div>

            {/* Mobile Actions */}
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-[#3b3b3b] hover:bg-[#e6ddd2] rounded-lg transition-colors duration-200 font-sans">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-[#3b3b3b] hover:bg-[#e6ddd2] hover:text-[#9c7c3a] rounded-lg transition-all duration-200 font-sans border border-transparent hover:border-[#9c7c3a]/20 group"
              >
                <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                <span className="font-light italic">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
