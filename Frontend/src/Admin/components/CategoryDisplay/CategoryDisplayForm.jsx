import React from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';

const CategoryDisplayForm = ({ showForm, editingCategory, formData, onFormDataChange, onSubmit, onCancel, selectedImageFile, setSelectedImageFile }) => {
  if (!showForm) return null;

  return (
    <div className="luxury-bg rounded-xl shadow-sm luxury-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <ImageIcon className="w-5 h-5 luxury-accent" />
        <h2 className="text-xl font-semibold luxury-text-primary">
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium luxury-text-primary mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border luxury-border rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-accent focus:border-transparent transition-colors luxury-bg text-gray-900 placeholder-gray-500"
              placeholder="Enter category name (e.g., Men, Women, Sneakers)"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium luxury-text-primary mb-2">
              Image URL or Upload
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => onFormDataChange({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 border luxury-border rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-accent focus:border-transparent transition-colors luxury-bg text-gray-900 placeholder-gray-500"
              placeholder="https://example.com/category-image.jpg"
            />
            <div className="mt-3">
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Or upload image file
              </label>

              <div className="flex items-center gap-3">

                {/* Upload Button */}
                <label className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8960B] hover:from-[#C9A227] hover:to-[#A17C00] text-black font-semibold rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-all duration-300">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setSelectedImageFile(e.target.files && e.target.files[0])}
                  />
                </label>

                {/* File Name */}
                <span className="text-sm text-gray-700">
                  {selectedImageFile ? selectedImageFile.name : 'No file chosen'}
                </span>
              </div>

              {/* Image Preview */}
              {selectedImageFile && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(selectedImageFile)}
                    alt="category preview"
                    className="w-52 h-52 object-cover rounded-xl border-2 border-[#D4AF37] shadow-md"
                  />
                </div>
              )}
            </div>

          </div>

          <div>
            <label className="block text-sm font-medium luxury-text-primary mb-2">
              Display Position
            </label>
            <input
              type="number"
              value={formData.position || 0}
              onChange={(e) => onFormDataChange({ ...formData, position: e.target.value ? parseInt(e.target.value) : 0 })}
              className="w-full px-4 py-3 border luxury-border rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-accent focus:border-transparent transition-colors luxury-bg text-gray-900 placeholder-gray-500"
              min="0"
              placeholder="0"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => onFormDataChange({ ...formData, active: e.target.checked })}
              className="h-5 w-5 text-[#D4AF37] focus:ring-[#D4AF37] border-[#D4AF37] rounded cursor-pointer"
            />
            <label htmlFor="active" className="ml-3 text-sm font-medium text-gray-800 cursor-pointer">
              Active Category
            </label>
          </div>

        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editingCategory ? 'Update Category' : 'Create Category'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>

        </div>
      </form>
    </div>
  );
};

export default CategoryDisplayForm;
