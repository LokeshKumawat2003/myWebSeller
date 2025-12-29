import React from 'react';
import { useAdmin } from './AdminContext';
import { LogOut, User, Shield, Bell } from 'lucide-react';

export default function AdminNavbar() {
  const { logout, admin } = useAdmin();

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 shadow-lg border-b border-indigo-700">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
            <p className="text-sm text-indigo-100 flex items-center gap-2">
              <User className="w-4 h-4" />
              {admin?.email || 'admin@agrimart.com'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
              <span className="sr-only">Notifications</span>
            </span>
          </button>

          {/* User Avatar */}
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
