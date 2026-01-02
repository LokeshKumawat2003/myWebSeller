import React from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';
import { Card } from '../UI';
import { useThemeColors } from '../../AdminContext';

const UserHeader = ({ totalUsers, activeUsers, inactiveUsers }) => {
  const colors = useThemeColors();

  return (
    <Card padding="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>User Management</h1>
          <p className="mt-1" style={{ color: colors.textSecondary }}>Manage platform users and their accounts</p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1" style={{ color: colors.textSecondary }}>
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Total Users</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: colors.accent }}>{totalUsers}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1" style={{ color: colors.textSecondary }}>
              <UserCheck className="w-4 h-4" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: colors.accent }}>{activeUsers}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1" style={{ color: colors.textSecondary }}>
              <UserX className="w-4 h-4" />
              <span className="text-sm font-medium">Inactive</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: colors.accent }}>{inactiveUsers}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserHeader;