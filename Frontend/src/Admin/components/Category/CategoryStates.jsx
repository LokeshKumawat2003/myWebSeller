import React from 'react';
import { Loader2, FolderOpen } from 'lucide-react';
import { Card, Loading } from '../UI';
import { useThemeColors } from '../../AdminContext';

const CategoryLoadingState = () => {
  return (
    <Card padding="p-12">
      <Loading text="Loading categories..." />
    </Card>
  );
};

const CategoryEmptyState = () => {
  const colors = useThemeColors();

  return (
    <Card padding="p-12">
      <div className="text-center">
        <FolderOpen className="w-16 h-16 mx-auto mb-4" style={{ color: colors.textSecondary }} />
        <h3 className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>No categories found</h3>
        <p style={{ color: colors.textSecondary }}>Get started by adding your first category or seeding basic categories</p>
      </div>
    </Card>
  );
};

export { CategoryLoadingState, CategoryEmptyState };