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
    <div className="bg-[#fbf7f2] rounded-xl shadow-md border border-[#e6ddd2] p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#e6ddd2] rounded-lg">
          <Settings className="w-6 h-6 text-[#9c7c3a]" />
        </div>
        <h2 className="text-lg md:text-xl font-light italic text-[#3b3b3b] font-serif">Store Settings</h2>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.includes('Error')
            ? 'bg-[#e6ddd2] border-[#9c7c3a] text-[#3b3b3b]'
            : 'bg-[#fbf7f2] border-[#e6ddd2] text-[#666]'
        }`}>
          <div className="flex items-center gap-2">
            {message.includes('Error') ? (
              <div className="w-5 h-5 rounded-full bg-[#9c7c3a] flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-[#9c7c3a] flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            {message}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-light italic text-[#3b3b3b] mb-2 flex items-center gap-2 font-serif">
            <Settings className="w-4 h-4" />
            Store Name
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Enter your store name"
            className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent transition-colors bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-light italic text-[#3b3b3b] mb-2 flex items-center gap-2 font-serif">
            <Upload className="w-4 h-4" />
            Logo URL
          </label>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent transition-colors bg-white"
          />
          {logoUrl && (
            <div className="mt-2 p-2 bg-[#e6ddd2] rounded-lg">
              <img
                src={logoUrl}
                alt="Logo preview"
                className="w-16 h-16 object-cover rounded-lg border border-[#e6ddd2]"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-light italic text-[#3b3b3b] mb-2 flex items-center gap-2 font-serif">
            <Image className="w-4 h-4" />
            Banner URL
          </label>
          <input
            type="url"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://example.com/banner.png"
            className="w-full px-4 py-3 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent transition-colors bg-white"
          />
          {bannerUrl && (
            <div className="mt-2 p-2 bg-[#e6ddd2] rounded-lg">
              <img
                src={bannerUrl}
                alt="Banner preview"
                className="w-full h-20 object-cover rounded-lg border border-[#e6ddd2]"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] rounded-lg font-light italic transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px] font-serif"
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