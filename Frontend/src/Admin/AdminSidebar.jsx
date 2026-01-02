import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { LayoutDashboard, Users, Package, ShoppingCart, User, Tag, Image, CreditCard, HeadphonesIcon, UserCircle, Menu } from 'lucide-react';
import SharedSidebar from '../components/SharedSidebar';
import { adminGetAllOrders, adminListSellers } from '../services/adminApi';
import { getAllSupportTickets } from '../services/api';
import ThemeSwitcher from './components/ThemeSwitcher';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sellers', label: 'Sellers', icon: Users },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'users', label: 'Users', icon: User },
  { id: 'categories', label: 'Categories', icon: Tag },
  { id: 'navigations', label: 'Navigation', icon: Menu },
  { id: 'banners', label: 'Banners', icon: Image },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'support', label: 'Support', icon: HeadphonesIcon },
];

function AdminSidebar({ activeTab, setActiveTab }) {
  const { admin, logout } = useAdmin();
  const [notifications, setNotifications] = useState({
    orders: 0,
    support: 0,
    users: 0
  });

  useEffect(() => {
    const fetchNotificationCounts = async () => {
      try {
        // Get pending orders count
        const ordersResponse = await adminGetAllOrders();
        const ordersData = Array.isArray(ordersResponse) ? ordersResponse : ordersResponse.orders || [];
        const pendingOrders = ordersData.filter(order => 
          order.status === 'pending' || order.status === 'processing'
        ).length;

        // Get pending sellers count (sellers waiting for approval)
        const sellersResponse = await adminListSellers();
        const sellersData = Array.isArray(sellersResponse) ? sellersResponse : sellersResponse.sellers || [];
        const pendingSellers = sellersData.filter(seller => seller.status === 'pending').length;

        // Get open support tickets count
        const supportResponse = await getAllSupportTickets();
        const supportData = Array.isArray(supportResponse) ? supportResponse : [];
        const openSupportTickets = supportData.filter(ticket => 
          ticket.status === 'open' || ticket.status === 'pending'
        ).length;

        setNotifications({
          orders: pendingOrders,
          support: openSupportTickets,
          users: pendingSellers
        });
      } catch (error) {
        console.error('Error fetching notification counts:', error);
        // Keep default values if API fails
        setNotifications({
          orders: 0,
          support: 0,
          users: 0
        });
      }
    };

    if (admin) {
      fetchNotificationCounts();
    }
  }, [admin]);

  return (
    <SharedSidebar
      menuItems={MENU_ITEMS}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      user={admin}
      logout={logout}
      logoutPath="/admin/login"
      theme="luxury"
      logoIcon={UserCircle}
      logoTitle="kalaqx"
      logoSubtitle="Admin Panel"
      notifications={notifications}
      additionalUserContent={<ThemeSwitcher />}
    />
  );
}
export default AdminSidebar;