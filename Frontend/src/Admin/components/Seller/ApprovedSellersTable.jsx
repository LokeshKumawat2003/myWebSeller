import React from 'react';
import { CheckCircle, Shield, ShieldCheck, Loader2, DollarSign } from 'lucide-react';
import { Card, Button } from '../UI';

const ApprovedSellersTable = ({ sellers, onBlock, onUnblock, approving }) => {
  return (
    <Card className="overflow-hidden">
      <div className="luxury-bg-secondary px-6 py-4 luxury-border">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 luxury-accent" />
          <h2 className="text-lg font-serif font-semibold luxury-text-primary">Approved Sellers ({sellers.length})</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="luxury-bg-secondary luxury-border">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold luxury-text-secondary uppercase tracking-wider">Store Name</th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold luxury-text-secondary uppercase tracking-wider">Owner Email</th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold luxury-text-secondary uppercase tracking-wider">Earnings</th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold luxury-text-secondary uppercase tracking-wider">Pending Payout</th>
              <th className="px-6 py-4 text-left text-xs font-serif font-semibold luxury-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y luxury-border">
            {sellers.map((seller) => (
              <tr key={seller._id} className="hover:luxury-bg-secondary transition-colors">
                <td className="px-6 py-4">
                  <div className="font-serif font-medium luxury-text-primary">{seller.storeName || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 text-sm font-sans luxury-text-secondary">
                  {seller.user?.email}
                </td>
                <td className="px-6 py-4 text-sm font-sans luxury-text-primary">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-serif font-medium">${(seller.earnings || 0).toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-sans luxury-text-primary">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    <span className="font-serif font-medium">${(seller.pendingPayout || 0).toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
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

export default ApprovedSellersTable;