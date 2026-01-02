import React from 'react';
import { Users } from 'lucide-react';
import { Card, Loading } from '../UI';
import { useThemeColors } from '../../AdminContext';

const UserLoadingState = () => {
  return (
    <Card padding="p-12">
      <Loading text="Loading users..." size="large" />
    </Card>
  );
};

const UserEmptyState = () => {
  const colors = useThemeColors();

  return (
    <Card padding="p-12">
      <div className="text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2 italic" style={{ color: colors.textPrimary }}>No users found</h3>
        <p className="italic" style={{ color: colors.textSecondary }}>Users will appear here once they register on the platform</p>
      </div>
    </Card>
  );
};

export { UserLoadingState, UserEmptyState };