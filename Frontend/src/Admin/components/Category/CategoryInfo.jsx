import React from 'react';
import { Info, Sprout } from 'lucide-react';
import { Card } from '../UI';

const CategoryInfo = () => {
  return (
    <Card className="luxury-bg-secondary luxury-border">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 luxury-accent mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold luxury-text-primary mb-2">About Basic Categories</h3>
          <p className="text-sm luxury-text-secondary mb-3">
            The "Seed Categories" button will create essential categories with predefined attributes for sizes, colors, and fits. This is useful for setting up your e-commerce platform quickly.
          </p>
          <div className="flex items-center gap-2 text-xs luxury-text-secondary">
            <Sprout className="w-4 h-4" />
            <span>Creates categories like Men, Women, Sneakers with proper attributes</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CategoryInfo;