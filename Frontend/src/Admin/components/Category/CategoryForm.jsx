import React from 'react';
import { FolderOpen, Save, X, Palette, Ruler, Shirt } from 'lucide-react';

const CategoryForm = ({
  showForm,
  editingId,
  formData,
  formLoading,
  onFormDataChange,
  onSubmit,
  onCancel
}) => {
  if (!showForm) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <FolderOpen className="w-5 h-5 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-900">
          {editingId ? 'Edit Category' : 'Add New Category'}
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter category name (e.g., Vegetables, Fruits)"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter category description"
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Available Sizes
              </div>
            </label>
            <input
              type="text"
              name="sizeValues"
              placeholder="XS, S, M, L, XL, XXL"
              value={formData.sizeValues}
              onChange={(e) => onFormDataChange({ ...formData, sizeValues: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated values, leave blank if not applicable</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Available Colors
              </div>
            </label>
            <input
              type="text"
              name="colorValues"
              placeholder="Red, Blue, Green, Black, White"
              value={formData.colorValues}
              onChange={(e) => onFormDataChange({ ...formData, colorValues: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated values, leave blank if not applicable</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4" />
                Available Fits
              </div>
            </label>
            <input
              type="text"
              name="fitValues"
              placeholder="Slim, Regular, Loose, Oversized"
              value={formData.fitValues}
              onChange={(e) => onFormDataChange({ ...formData, fitValues: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated values, leave blank if not applicable</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={formLoading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {formLoading ? (
              <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {formLoading ? 'Saving...' : 'Save Category'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;