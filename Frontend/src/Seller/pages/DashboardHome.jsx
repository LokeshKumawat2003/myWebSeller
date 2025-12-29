import React, { useState, useEffect } from 'react';
import { getSellerProfile } from '../../services/api';
import { getSellerEarnings } from '../../services/sellerApi';
import WelcomeSection from '../components/Dashboard/WelcomeSection';
import StatsCards from '../components/Dashboard/StatsCards';
import StoreInfo from '../components/Dashboard/StoreInfo';
import RecentProducts from '../components/Dashboard/RecentProducts';

export default function DashboardHome({ seller, products }) {
  const [sellerData, setSellerData] = useState(seller || {});
  const [earningsData, setEarningsData] = useState(null);

  useEffect(() => {
    fetchSellerData();
    fetchEarningsData();
  }, []);

  const fetchSellerData = async () => {
    try {
      const data = await getSellerProfile();
      setSellerData(data);
    } catch (err) {
      console.error('Error fetching seller data:', err);
    }
  };

  const fetchEarningsData = async () => {
    try {
      const data = await getSellerEarnings();
      setEarningsData(data || {});
    } catch (err) {
      console.error('Error fetching earnings:', err);
      setEarningsData({});
    }
  };

  const stats = [
    { label: 'Total Products', value: products?.length || 0, color: 'bg-[#9c7c3a]' },
    { label: 'Total Earnings', value: `₹${(earningsData?.totalEarned || 0).toFixed(2)}`, color: 'bg-[#9c7c3a]' },
    { label: 'Pending Payout', value: `₹${(earningsData?.totalPending || 0).toFixed(2)}`, color: 'bg-[#e6ddd2] text-[#3b3b3b]' },
    { label: 'Status', value: sellerData?.blocked ? 'Blocked' : sellerData?.approved ? 'Approved' : 'Pending', color: sellerData?.blocked ? 'bg-[#e6ddd2] text-[#3b3b3b]' : sellerData?.approved ? 'bg-[#9c7c3a]' : 'bg-[#e6ddd2] text-[#3b3b3b]' },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <WelcomeSection sellerName={seller?.name} />
      <StatsCards stats={stats} />
      <StoreInfo sellerData={sellerData} earningsData={earningsData} />
      <RecentProducts products={products} />
    </div>
  );
}
