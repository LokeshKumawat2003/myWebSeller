import React, { useState, useEffect } from 'react';
import { adminListSellers, adminGetAllProducts, adminGetAllOrders, adminBlockSeller, adminUnblockSeller } from '../../services/adminApi';
import { adminListNewArrivals } from '../../services/adminApi';
import {
  Users,
  Clock,
  ShieldX,
  Package,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  ShoppingCart,
  DollarSign,
  Loader2,
  RefreshCw,
  Zap
} from 'lucide-react';
import StatsCard from '../components/Dashbord/StatsCard';
import RecentSellers from '../components/Dashbord/RecentSellers';
import RecentOrders from '../components/Dashbord/RecentOrders';
import DashboardHeader from '../components/Dashbord/DashboardHeader';
import NewArrivalsManagement from '../components/NewArrivalsManagement';

export default function DashboardOverview() {
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newArrivalsCount, setNewArrivalsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (loading) return; // Prevent multiple simultaneous loads
    setLoading(true);
    setError('');

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false);
      setError('Request timed out. Please check your connection and try again.');
    }, 10000); // 10 second timeout

    try {
      const [sellersData, productsData, ordersData, arrivalsData] = await Promise.all([
        adminListSellers(),
        adminGetAllProducts(),
        adminGetAllOrders().catch(() => []),
        adminListNewArrivals().catch(() => ({ newArrivals: [] }))
      ]);
      clearTimeout(timeout); // Clear timeout on success
      setSellers(sellersData || []);
      setProducts(productsData.products || []);
      setOrders(ordersData || []);
      setNewArrivalsCount((arrivalsData.newArrivals || []).length);
    } catch (err) {
      clearTimeout(timeout);
      console.error('Error loading data:', err);
      setError('Failed to load dashboard data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockSeller = async (sellerId) => {
    setActionLoading(sellerId);
    try {
      await adminBlockSeller(sellerId);
      await loadData();
    } catch (err) {
      console.error('Error blocking seller', err);
      alert('Error blocking seller: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblockSeller = async (sellerId) => {
    setActionLoading(sellerId);
    try {
      await adminUnblockSeller(sellerId);
      await loadData();
    } catch (err) {
      console.error('Error unblocking seller', err);
      alert('Error unblocking seller: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingSellers = Array.isArray(sellers) ? sellers.filter(s => !s.approved).length : 0;
  const blockedSellers = Array.isArray(sellers) ? sellers.filter(s => s.blocked).length : 0;
  const totalRevenue = Array.isArray(orders) ? orders.reduce((sum, order) => sum + (order.total || 0), 0) : 0;

  // product status breakdown
  const statusCounts = { draft: 0, pending: 0, approved: 0, rejected: 0 };
  if (Array.isArray(products)) {
    for (const p of products) {
      const s = p.status || 'pending';
      if (statusCounts[s] === undefined) statusCounts[s] = 0;
      statusCounts[s]++;
    }
  }

  const newArrivalsCountOld = Array.isArray(products) ? products.filter(p => p.isNew).length : 0;

  const stats = [
    { label: 'Total Sellers', value: Array.isArray(sellers) ? sellers.length : 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Pending Approvals', value: pendingSellers, icon: Clock, color: 'bg-orange-500' },
    { label: 'Blocked Sellers', value: blockedSellers, icon: ShieldX, color: 'bg-red-500' },
    { label: 'Total Products', value: Array.isArray(products) ? products.length : 0, icon: Package, color: 'bg-green-500' },
    { label: 'Drafts', value: statusCounts.draft || 0, icon: FileText, color: 'bg-gray-500' },
    { label: 'Pending Products', value: statusCounts.pending || 0, icon: AlertCircle, color: 'bg-yellow-500' },
    { label: 'Approved Products', value: statusCounts.approved || 0, icon: CheckCircle, color: 'bg-green-600' },
    { label: 'Rejected Products', value: statusCounts.rejected || 0, icon: XCircle, color: 'bg-red-500' },
    { label: 'New Arrivals', value: newArrivalsCount, icon: Zap, color: 'bg-purple-600' },
    { label: 'Total Orders', value: Array.isArray(orders) ? orders.length : 0, icon: ShoppingCart, color: 'bg-purple-500' },
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-emerald-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <DashboardHeader onRefresh={loadData} loading={loading} />

        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-1">Unable to Load Dashboard Data</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>

        {/* Basic Stats with Default Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard title="Total Sellers" value="0" icon={Users} color="bg-blue-500" />
          <StatsCard title="Total Products" value="0" icon={Package} color="bg-green-500" />
          <StatsCard title="Total Orders" value="0" icon={ShoppingCart} color="bg-purple-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader onRefresh={loadData} loading={loading} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatsCard
            key={idx}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* New Arrivals Management */}
      <NewArrivalsManagement />

      {/* Recent Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSellers
          sellers={sellers}
          onBlockSeller={handleBlockSeller}
          onUnblockSeller={handleUnblockSeller}
          actionLoading={actionLoading}
        />
        <RecentOrders orders={orders} />
      </div>
    </div>
  );
}
