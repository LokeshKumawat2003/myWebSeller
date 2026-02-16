import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { LogOut, User, Shield, Bell, Menu, X } from 'lucide-react';
import Logo from '../components/Logo';

export default function AdminNavbar({ admin, onMenuClick }) {
  const { logout } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="luxury-bg shadow-sm luxury-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">

            {/* Left Section - Logo and Admin Info */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 luxury-text-primary hover:luxury-bg-secondary rounded-lg transition-colors duration-200"
                aria-label="Open sidebar menu"
              >
                <Menu size={20} />
              </button>

              {/* Admin Logo */}
              <div className="w-10 h-10 lg:w-12 lg:h-12 luxury-bg-secondary rounded-xl flex items-center justify-center shadow-sm">
                <Logo size="sm" />
              </div>

              {/* Admin Info - Hidden on mobile, visible on larger screens */}
              <div className="hidden sm:block">
                <h1 className="text-lg lg:text-xl font-light italic luxury-text-primary font-serif">
                  Admin Dashboard
                </h1>
                <div className="flex items-center gap-2 text-sm luxury-text-secondary font-sans">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-[200px]">{admin?.email || 'admin@kalaqx.com'}</span>
                </div>
              </div>
            </div>

            {/* Center Section - Status Badge (Desktop Only) */}
            <div className="hidden md:flex items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-light italic bg-[#9c7c3a] text-white font-serif shadow-sm">
                <Shield className="w-4 h-4" />
                <span>Administrator</span>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Notifications */}
              <button className="relative p-2 luxury-text-primary hover:luxury-bg-secondary rounded-lg transition-colors duration-200 group">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 luxury-accent rounded-full flex items-center justify-center">
                  <span className="sr-only">Notifications</span>
                </span>
                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 luxury-bg-secondary luxury-text-primary text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap font-sans">
                  Notifications
                </div>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="sm:hidden p-2 luxury-text-primary hover:luxury-bg-secondary rounded-lg transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <User size={20} />}
              </button>

              {/* Desktop Logout */}
              <div
                onClick={logout}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 luxury-accent hover:luxury-accent/90 text-white rounded-lg text-sm font-light italic transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-luxury-accent/25 luxury-border hover:border-luxury-accent/40 font-serif group"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                <span>Logout</span>
              </div>

              {/* Desktop User Avatar */}
              <div className="hidden sm:flex w-10 h-10 luxury-bg-secondary rounded-full items-center justify-center shadow-sm">
                <Shield className="w-5 h-5 luxury-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Status Bar */}
        <div className="md:hidden luxury-border luxury-bg-secondary">
          <div className="px-4 py-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-light italic luxury-accent text-white font-serif">
              <Shield className="w-3 h-3" />
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed top-16 left-0 right-0 luxury-bg luxury-border shadow-lg z-40">
          <div className="px-4 py-4 space-y-4">
            {/* Admin Info */}
            <div className="luxury-border pb-4">
              <h2 className="text-lg font-light italic luxury-text-primary font-serif mb-1">
                Admin Dashboard
              </h2>
              <p className="text-sm luxury-text-secondary flex items-center gap-2 font-sans">
                <User className="w-4 h-4" />
                {admin?.email || 'admin@kalaqx.com'}
              </p>
            </div>

            {/* Mobile Actions */}
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left luxury-text-primary hover:luxury-bg-secondary rounded-lg transition-colors duration-200 font-sans">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left luxury-text-primary hover:luxury-bg-secondary hover:luxury-accent rounded-lg transition-all duration-200 font-sans luxury-border hover:border-luxury-accent/20 group"
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
