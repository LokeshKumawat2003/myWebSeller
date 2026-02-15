import React from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';

const BannerForm = ({ showForm, editingBanner, formData, onFormDataChange, onSubmit, onCancel, selectedImageFile, setSelectedImageFile }) => {
  if (!showForm) return null;

  return (
    <div className="luxury-bg rounded-xl shadow-sm luxury-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <ImageIcon className="w-5 h-5 luxury-accent" />
        <h2 className="text-xl font-semibold luxury-text-primary">
          {editingBanner ? 'Edit Banner' : 'Add New Banner'}
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium luxury-text-primary mb-2">
              Banner Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border luxury-border rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-accent focus:border-transparent transition-colors luxury-bg"
              placeholder="Enter banner title"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium luxury-text-primary mb-2">
              Image URL or Upload
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => onFormDataChange({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-3 border luxury-border rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-accent focus:border-transparent transition-colors luxury-bg"
              placeholder="https://example.com/banner-image.jpg"
            />
            <div className="mt-3">
              <label className="block text-sm font-medium luxury-text-primary mb-1">Or upload image file</label>
              <input type="file" accept="image/*" onChange={(e) => setSelectedImageFile(e.target.files && e.target.files[0])} />
              {selectedImageFile && (
                <div className="mt-2">
                  <img src={URL.createObjectURL(selectedImageFile)} alt="banner preview" className="w-48 h-24 object-cover rounded" />
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
              className="w-full px-4 py-3 border luxury-border rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-accent focus:border-transparent transition-colors luxury-bg"
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
              className="h-5 w-5 luxury-accent focus:ring-luxury-accent border luxury-border rounded"
            />
            <label htmlFor="active" className="ml-3 text-sm font-medium luxury-text-primary">
              Active Banner
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-3 luxury-accent hover:bg-luxury-accent text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {editingBanner ? 'Update Banner' : 'Create Banner'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 luxury-bg-secondary hover:bg-luxury-accent luxury-accent rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BannerForm;