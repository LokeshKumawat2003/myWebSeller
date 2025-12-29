import React, { useState } from 'react';
import { Settings, Upload, Image, Save } from 'lucide-react';

const StoreSettingsForm = ({ seller, onSubmit, loading, message }) => {
  const [storeName, setStoreName] = useState(seller?.storeName || '');
  const [logoUrl, setLogoUrl] = useState(seller?.logoUrl || '');
  const [bannerUrl, setBannerUrl] = useState(seller?.bannerUrl || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      storeName,
      logoUrl,
      bannerUrl,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Settings className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Store Settings</h2>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.includes('Error')
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-green-50 border-green-200 text-green-800'
        }`}>
          <div className="flex items-center gap-2">
            {message.includes('Error') ? (
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-xs">!</span>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
            )}
            {message}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Store Name
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Enter your store name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Logo URL
          </label>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
          {logoUrl && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg">
              <img
                src={logoUrl}
                alt="Logo preview"
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Image className="w-4 h-4" />
            Banner URL
          </label>
          <input
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://example.com/banner.png"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          />
          {bannerUrl && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg">
              <img
                src={bannerUrl}
                alt="Banner preview"
                className="w-full h-20 object-cover rounded-lg border border-gray-200"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default StoreSettingsForm;