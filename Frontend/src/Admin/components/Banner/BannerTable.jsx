import React from 'react';
import { Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';

const BannerTable = ({ banners, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="luxury-bg rounded-xl shadow-sm luxury-border p-12">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin luxury-accent mr-3" />
          <p className="luxury-text-secondary font-medium italic">Loading banners...</p>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="luxury-bg rounded-xl shadow-sm luxury-border p-12">
        <div className="text-center">
          <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium luxury-text-primary mb-2 italic">No banners found</h3>
          <p className="luxury-text-secondary italic">Get started by adding your first banner</p>
        </div>
      </div>
    );
  }

  return (
    <div className="luxury-bg rounded-xl shadow-sm luxury-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="luxury-bg-secondary luxury-border">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold luxury-text-secondary uppercase tracking-wider">Preview</th>
              <th className="px-6 py-4 text-left text-xs font-semibold luxury-text-secondary uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold luxury-text-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold luxury-text-secondary uppercase tracking-wider">Position</th>
              <th className="px-6 py-4 text-left text-xs font-semibold luxury-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y luxury-border">
            {banners.map((banner) => (
              <tr key={banner._id} className="hover:bg-luxury-bg-secondary transition-colors">
                <td className="px-6 py-4">
                  <div className="flex-shrink-0">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-24 h-14 object-cover rounded-lg luxury-border"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium luxury-text-primary">{banner.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {banner.active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Eye className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Inactive
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm luxury-text-primary">
                  {banner.position || 0}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(banner)}
                      className="inline-flex items-center px-3 py-1.5 luxury-bg-secondary hover:bg-luxury-accent luxury-accent rounded-lg text-sm font-medium transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(banner._id)}
                      className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannerTable;