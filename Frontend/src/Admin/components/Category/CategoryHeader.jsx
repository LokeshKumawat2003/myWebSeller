import React from 'react';
import { FolderOpen, Plus, Sprout } from 'lucide-react';
import { Card, Button } from '../UI';
import { useThemeColors } from '../../AdminContext';

const CategoryHeader = ({ onAddNew, onSeedCategories }) => {
  const colors = useThemeColors();

  return (
    <Card padding="p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Category Management</h1>
          <p className="mt-1" style={{ color: colors.textSecondary }}>Organize products into categories and manage attributes</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="large"
            onClick={onAddNew}
          >
            <Plus className="w-5 h-5" />
            Add Category
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CategoryHeader;