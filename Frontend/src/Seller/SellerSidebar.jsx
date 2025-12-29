import React, { useState, useEffect } from 'react';
import { useSeller } from './SellerContext';
import { LayoutDashboard, Package, ShoppingCart, DollarSign, Settings, HeadphonesIcon, Store } from 'lucide-react';
import SharedSidebar from '../components/SharedSidebar';
import { getSellerOrders, sellerGetMyProducts, getAssignedSupportTickets } from '../services/api';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'earnings', label: 'Earnings & Payouts', icon: DollarSign },
  { id: 'support', label: 'Support', icon: HeadphonesIcon },
  { id: 'settings', label: 'Store Settings', icon: Settings },
];

export default function SellerSidebar({ activeTab, setActiveTab }) {
  const { seller, logout } = useSeller();
  const [notifications, setNotifications] = useState({
    orders: 0,
    products: 0,
    support: 0
  });

  useEffect(() => {
    const fetchNotificationCounts = async () => {
      try {
        // Get seller's orders and count pending ones
        const ordersResponse = await getSellerOrders();
        const ordersData = Array.isArray(ordersResponse) ? ordersResponse : ordersResponse.orders || [];
        const pendingOrders = ordersData.filter(order => 
          order.status === 'pending' || order.status === 'processing'
        ).length;

        // Get seller's products and count pending approval ones
        const productsResponse = await sellerGetMyProducts();
        const productsData = Array.isArray(productsResponse) ? productsResponse : productsResponse.products || [];
        const pendingProducts = productsData.filter(product => 
          product.status === 'pending' || product.status === 'waiting_approval'
        ).length;

        // Get assigned support tickets count
        const supportResponse = await getAssignedSupportTickets();
        const supportData = Array.isArray(supportResponse) ? supportResponse : [];
        const openSupportTickets = supportData.filter(ticket => 
          ticket.status === 'open' || ticket.status === 'pending'
        ).length;

        setNotifications({
          orders: pendingOrders,
          products: pendingProducts,
          support: openSupportTickets
        });
      } catch (error) {
        console.error('Error fetching notification counts:', error);
        // Keep default values if API fails
        setNotifications({
          orders: 0,
          products: 0,
          support: 0
        });
      }
    };

    if (seller) {
      fetchNotificationCounts();
    }
  }, [seller]);

  return (
    <SharedSidebar
      menuItems={MENU_ITEMS}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      user={seller}
      logout={logout}
      logoutPath="/seller/login"
      theme="luxury"
      logoIcon={Store}
      logoTitle="AgriMart"
      logoSubtitle="Seller Panel"
      notifications={notifications}
    />
  );
}
