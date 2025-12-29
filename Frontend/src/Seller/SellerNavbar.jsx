import React from 'react';
import { useSeller } from './SellerContext';
import { Menu, LogOut, Store, User, Bell, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function SellerNavbar({ seller, onMenuClick }) {
  const { logout } = useSeller();

  const getStatusInfo = () => {
    if (!seller) return { color: 'bg-amber-100 text-amber-800', icon: Clock, text: 'Loading...' };

    if (seller.blocked) {
      return { color: 'bg-[#e6ddd2] text-[#3b3b3b]', icon: XCircle, text: 'Blocked' };
    } else if (seller.approved) {
      return { color: 'bg-[#9c7c3a] text-white', icon: CheckCircle, text: 'Approved' };
    } else {
      return { color: 'bg-[#fbf7f2] text-[#666] border border-[#e6ddd2]', icon: Clock, text: 'Pending Approval' };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-[#fbf7f2] shadow-lg border-b border-[#e6ddd2]">
      <div className="px-4 lg:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-[#3b3b3b] hover:bg-[#e6ddd2] rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="w-10 h-10 bg-[#e6ddd2] rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-[#9c7c3a]" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#3b3b3b] font-serif">
              {seller?.storeName || 'Seller Dashboard'}
            </h2>
            <p className="text-sm text-[#666] flex items-center gap-2 font-sans">
              <User className="w-4 h-4" />
              {seller?.user?.email || 'seller@agrimart.com'}
            </p>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color} font-sans`}>
                <StatusIcon className="w-3 h-3" />
                {statusInfo.text}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          <button className="relative p-2 text-[#3b3b3b] hover:bg-[#e6ddd2] rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#9c7c3a] rounded-full text-xs flex items-center justify-center">
              <span className="sr-only">Notifications</span>
            </span>
          </button>

          {/* User Avatar */}
          <div className="w-10 h-10 bg-[#e6ddd2] rounded-full flex items-center justify-center">
            <Store className="w-5 h-5 text-[#9c7c3a]" />
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-[#9c7c3a] hover:bg-[#8a6a2f] text-white rounded-lg text-sm font-medium transition-colors shadow-md font-sans"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
