import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import AdminNavbar from './AdminNavbar';
// import AdminSidebar from './AdminSidebar';
import DashboardOverview from './pages/DashboardOverview';
import SellerManagement from './pages/SellerManagement';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement';
import UserManagement from './pages/UserManagement';
import CategoryManagement from './pages/CategoryManagement';
import PaymentManagement from './pages/PaymentManagement';
import BannerManagement from './pages/BannerManagement';
import SupportManagement from './components/Support/SupportManagement';
import NavigationManagement from './components/NavigationManagement';
import AdminSidebar from './AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminDashboard() {
  const { admin, isAuthenticated, loading } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin-login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9c7c3a]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'sellers':
        return <SellerManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'banners':
        return <BannerManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'support':
        return <SupportManagement />;
      case 'navigations':
        return <NavigationManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#fbf7f2] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:block`}>
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            closeMobileSidebar();
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-0">
        <AdminNavbar admin={admin} onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}