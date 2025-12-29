import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeller } from './SellerContext';
import { sellerGetMyProducts, sellerCreateProduct } from '../services/api';
import SellerNavbar from './SellerNavbar';
import SellerSidebar from './SellerSidebar';
import ProductManagement from './pages/ProductManagement';
import DashboardHome from './pages/DashboardHome';
import StoreSettings from './pages/StoreSettings';
import Orders from './pages/Orders';
import SellerEarnings from './pages/SellerEarnings';
import SellerSupportChat from './SellerSupportChat';

export default function SellerDashboard() {
  const { seller, isAuthenticated, loading } = useSeller();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/seller-login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await sellerGetMyProducts();
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome seller={seller} products={products} />;
      case 'products':
        return <ProductManagement seller={seller} products={products} onRefresh={loadProducts} />;
      case 'orders':
        return <Orders />;
      case 'earnings':
        return <SellerEarnings />;
      case 'settings':
        return <StoreSettings seller={seller} />;
      case 'support':
        return <SellerSupportChat />;
      default:
        return <DashboardHome seller={seller} products={products} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#fbf7f2]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <SellerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <SellerNavbar seller={seller} onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

