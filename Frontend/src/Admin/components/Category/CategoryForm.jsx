import React from 'react';
import { FolderOpen, Save, X, Palette, Ruler, Shirt } from 'lucide-react';
import { Card, Button, Input, Textarea } from '../UI';
import { useThemeColors } from '../../AdminContext';

const CategoryForm = ({
  showForm,
  editingId,
  formData,
  formLoading,
  onFormDataChange,
  onSubmit,
  onCancel
}) => {
  const colors = useThemeColors();

  if (!showForm) return null;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <FolderOpen className="w-5 h-5" style={{ color: colors.accent }} />
        <h2 className="text-xl font-semibold" style={{ color: colors.textPrimary }}>
          {editingId ? 'Edit Category' : 'Add New Category'}
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Category Name"
              type="text"
              name="name"
              placeholder="Enter category name (e.g., Vegetables, Fruits)"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Description"
              name="description"
              placeholder="Enter category description"
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>

          <div>
            <Input
              label={
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Available Sizes
                </div>
              }
              type="text"
              name="sizeValues"
              placeholder="XS, S, M, L, XL, XXL"
              value={formData.sizeValues}
              onChange={(e) => onFormDataChange({ ...formData, sizeValues: e.target.value })}
              helperText="Comma-separated values, leave blank if not applicable"
            />
          </div>

          <div>
            <Input
              label={
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Available Colors
                </div>
              }
              type="text"
              name="colorValues"
              placeholder="Red, Blue, Green, Black, White"
              value={formData.colorValues}
              onChange={(e) => onFormDataChange({ ...formData, colorValues: e.target.value })}
              helperText="Comma-separated values, leave blank if not applicable"
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label={
                <div className="flex items-center gap-2">
                  <Shirt className="w-4 h-4" />
                  Available Fits
                </div>
              }
              type="text"
              name="fitValues"
              placeholder="Slim, Regular, Loose, Oversized"
              value={formData.fitValues}
              onChange={(e) => onFormDataChange({ ...formData, fitValues: e.target.value })}
              helperText="Comma-separated values, leave blank if not applicable"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={formLoading}
            loading={formLoading}
          >
            <Save className="w-4 h-4" />
            {formLoading ? 'Saving...' : 'Save Category'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CategoryForm;