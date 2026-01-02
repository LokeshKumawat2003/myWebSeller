import React, { useState, useEffect } from 'react';
import { adminListSellers, adminApproveSeller, adminBlockSeller, adminUnblockSeller } from '../../services/adminApi';
import SellerHeader from '../components/Seller/SellerHeader';
import PendingSellersTable from '../components/Seller/PendingSellersTable';
import ApprovedSellersTable from '../components/Seller/ApprovedSellersTable';
import CreateSellerForm from '../components/Seller/CreateSellerForm';
import { SellerLoadingState, SellerEmptyState } from '../components/Seller/SellerStates';
import { Button } from '../components/UI';

export default function SellerManagement() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <SellerHeader
          total={sellers.length}
          approved={approvedSellers.length}
          pending={pendingSellers.length}
        />
        <div className="flex justify-center lg:justify-end">
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(true)}
            size="medium"
            className="w-full sm:w-auto"
          >
            + Create Seller
          </Button>
        </div>
      </div>

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

      {showCreateForm && (
        <CreateSellerForm
          onSellerCreated={loadSellers}
          onClose={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}
