import React from 'react';
import { Card, Button, Badge } from '../components/UI';
import { useThemeColors } from '../AdminContext';

const RecentSellers = ({ sellers, actionLoading, handleBlockSeller, handleUnblockSeller }) => {
  const colors = useThemeColors();

  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 italic" style={{ color: colors.textPrimary }}>
        <span style={{ color: colors.accent }}>🏪</span>
        Recent Sellers
      </h2>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {Array.isArray(sellers) && sellers.slice(0, 5).map((seller) => (
          <div key={seller._id} className="flex justify-between items-center p-4 rounded-lg transition-colors" style={{ backgroundColor: colors.bgSecondary }}>
            <div className="flex-1">
              <p className="font-semibold italic" style={{ color: colors.textPrimary }}>{seller.storeName || 'No Store'}</p>
              <p className="text-sm italic" style={{ color: colors.textSecondary }}>{seller.user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  seller.blocked ? 'danger' :
                  seller.approved ? 'success' : 'warning'
                }
              >
                {seller.blocked ? 'Blocked' : (seller.approved ? 'Approved' : 'Pending')}
              </Badge>
              {seller.blocked ? (
                <Button
                  variant="success"
                  size="small"
                  onClick={() => handleUnblockSeller(seller._id)}
                  disabled={actionLoading === seller._id}
                >
                  {actionLoading === seller._id ? '...' : 'Unblock'}
                </Button>
              ) : (
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleBlockSeller(seller._id)}
                  disabled={actionLoading === seller._id}
                >
                  {actionLoading === seller._id ? '...' : 'Block'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentSellers;