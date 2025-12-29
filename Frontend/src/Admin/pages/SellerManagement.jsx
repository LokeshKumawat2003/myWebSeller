import React, { useState, useEffect } from 'react';
import { adminListSellers, adminApproveSeller, adminBlockSeller, adminUnblockSeller } from '../../services/adminApi';
import SellerHeader from '../components/Seller/SellerHeader';
import PendingSellersTable from '../components/Seller/PendingSellersTable';
import ApprovedSellersTable from '../components/Seller/ApprovedSellersTable';
import { SellerLoadingState, SellerEmptyState } from '../components/Seller/SellerStates';

export default function SellerManagement() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    setLoading(true);
    try {
      const data = await adminListSellers();
      setSellers(data || []);
    } catch (err) {
      console.error('Error loading sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSeller = async (sellerId) => {
    setApproving(sellerId);
    try {
      await adminApproveSeller(sellerId);
      alert('Seller approved successfully!');
      loadSellers();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setApproving(null);
    }
  };

  const handleBlockSeller = async (sellerId) => {
    setApproving(sellerId);
    try {
      await adminBlockSeller(sellerId);
      alert('Seller blocked successfully');
      loadSellers();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setApproving(null);
    }
  };

  const handleUnblockSeller = async (sellerId) => {
    setApproving(sellerId);
    try {
      await adminUnblockSeller(sellerId);
      alert('Seller unblocked successfully');
      loadSellers();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setApproving(null);
    }
  };

  const pendingSellers = sellers.filter(s => !s.approved);
  const approvedSellers = sellers.filter(s => s.approved);

  return (
    <div className="space-y-6">
      <SellerHeader
        total={sellers.length}
        approved={approvedSellers.length}
        pending={pendingSellers.length}
      />

      {loading ? (
        <SellerLoadingState />
      ) : sellers.length === 0 ? (
        <SellerEmptyState />
      ) : (
        <div className="space-y-6">
          <PendingSellersTable
            sellers={pendingSellers}
            onApprove={handleApproveSeller}
            onBlock={handleBlockSeller}
            onUnblock={handleUnblockSeller}
            approving={approving}
          />

          <ApprovedSellersTable
            sellers={approvedSellers}
            onBlock={handleBlockSeller}
            onUnblock={handleUnblockSeller}
            approving={approving}
          />
        </div>
      )}
    </div>
  );
}
