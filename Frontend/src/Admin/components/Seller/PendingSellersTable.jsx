import React from 'react';
import { Clock, Check, Shield, ShieldCheck, Loader2 } from 'lucide-react';
import { Card, Button } from '../UI';
import { useThemeColors } from '../../AdminContext';

const PendingSellersTable = ({ sellers, onApprove, onBlock, onUnblock, approving }) => {
  const colors = useThemeColors();

  if (sellers.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border, borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" style={{ color: colors.accent }} />
          <h2 className="text-lg font-serif font-semibold" style={{ color: colors.textPrimary }}>Pending Approvals ({sellers.length})</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border, borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Store Name</th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Owner Email</th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Earnings</th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id} className="transition-colors" style={{ borderColor: colors.border, borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
                <td className="px-6 py-4">
                  <div className="font-serif font-medium" style={{ color: colors.textPrimary }}>{seller.storeName || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 text-sm font-sans" style={{ color: colors.textSecondary }}>
                  {seller.user?.email}
                </td>
                <td className="px-6 py-4 text-sm font-sans" style={{ color: colors.textPrimary }}>
                  <div className="flex items-center gap-1">
                    <span className="font-serif font-medium">${(seller.earnings || 0).toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => onApprove(seller._id)}
                      disabled={approving === seller._id}
                    >
                      {approving === seller._id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-1" />
                      )}
                      Approve
                    </Button>
                    {seller.blocked ? (
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => onUnblock(seller._id)}
                        disabled={approving === seller._id}
                      >
                        {approving === seller._id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 mr-1" />
                        )}
                        Unblock
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => onBlock(seller._id)}
                        disabled={approving === seller._id}
                      >
                        {approving === seller._id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Shield className="w-4 h-4 mr-1" />
                        )}
                        Block
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PendingSellersTable;