import React, { useState, useEffect } from 'react';
import { sellerRequestAccount, getSellerProfile } from '../../services/api';
import { getSellerEarnings } from '../../services/sellerApi';
import { Settings as SettingsIcon } from 'lucide-react';
import StoreInfoCard from '../components/Settings/StoreInfoCard';
import StoreSettingsForm from '../components/Settings/StoreSettingsForm';
import AccountStatusCard from '../components/Settings/AccountStatusCard';
import SellerPayout from '../SellerPayout';

export default function StoreSettings({ seller }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sellerData, setSellerData] = useState(seller || {});
  const [earningsData, setEarningsData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    fetchSellerData();
    fetchEarningsData();
  }, []);

  const fetchSellerData = async () => {
    try {
      console.log('Fetching seller data...');
      const data = await getSellerProfile();
      console.log('Seller data received:', data);
      setSellerData(data);
    } catch (err) {
      console.error('Error fetching seller data:', err);
    }
  };

  const fetchEarningsData = async () => {
    setLoadingData(true);
    try {
      console.log('Fetching earnings data...');
      const data = await getSellerEarnings();
      console.log('Earnings data received:', data);
      setEarningsData(data || {});
    } catch (err) {
      console.error('Error fetching earnings:', err);
      setEarningsData({});
    }
    setLoadingData(false);
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setMessage('');
    try {
      await sellerRequestAccount(formData);
      setMessage('Store settings updated successfully!');
      // Refresh data after successful update
      await fetchSellerData();
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchSellerData(), fetchEarningsData()]);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-[#fbf7f2] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-light italic text-[#3b3b3b] flex items-center gap-3 font-serif">
            <SettingsIcon className="w-8 h-8 text-[#9c7c3a]" />
            Store Settings
          </h1>
          <p className="text-sm md:text-base text-[#666] mt-2 font-sans">Manage your store information and account settings</p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Store Information */}
          <StoreInfoCard sellerData={sellerData} />

          {/* Store Settings Form */}
          <StoreSettingsForm
            seller={seller}
            onSubmit={handleSubmit}
            loading={loading}
            message={message}
          />

          {/* Account Status */}
          <AccountStatusCard
            sellerData={sellerData}
            earningsData={earningsData}
            loadingData={loadingData}
            onRefresh={handleRefresh}
          />

          {/* Payout settings (one-time set / change request) */}
          <SellerPayout />
        </div>
      </div>
    </div>
  );
}
