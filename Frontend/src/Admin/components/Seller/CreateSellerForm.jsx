import React, { useState } from 'react';
import { adminCreateSeller } from '../../../services/adminApi';
import { Input, Button, Modal, Form } from '../UI';
import { User, Mail, Phone, Lock, Store, Image, Link, Loader2 } from 'lucide-react';
import { useThemeColors } from '../../AdminContext';

export default function CreateSellerForm({ onSellerCreated, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    storeName: '',
    logoUrl: '',
    bannerUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const colors = useThemeColors();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminCreateSeller(formData);
      // You might want to use a toast notification here instead of alert for a better UI
      alert('Seller created successfully!');
      onSellerCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create seller');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Create New Seller"
      size="large" // Increased size for the grid layout
      footer={null} // We'll put the buttons inside the form for better control or keep them here if preferred, but let's stick to the previous pattern or improve it. safely keeping footer null and adding buttons in form or custom footer content. Actually, let's use the footer prop for buttons to be consistent with the Modal component design.
    >
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="w-1 h-full bg-red-500 rounded-full mr-2"></div>
          {error}
        </div>
      )}

      <Form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Account Information Section */}
          <div className="space-y-4">
            <h4
              className="text-sm font-semibold uppercase tracking-wider border-b pb-2 mb-4 flex items-center gap-2"
              style={{ color: colors.textSecondary, borderColor: colors.border }}
            >
              <User size={16} /> Account Details
            </h4>

            <div className="relative">
              <div className="absolute left-3 top-9" style={{ color: colors.textSecondary }}>
                <User size={18} />
              </div>
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="pl-10 transition-all focus:ring-2 focus:ring-offset-1"
                placeholder="John Doe"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-9" style={{ color: colors.textSecondary }}>
                <Mail size={18} />
              </div>
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="pl-10"
                placeholder="john@example.com"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-9" style={{ color: colors.textSecondary }}>
                <Phone size={18} />
              </div>
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="pl-10"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-9" style={{ color: colors.textSecondary }}>
                <Lock size={18} />
              </div>
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Store Details Section */}
          <div className="space-y-4">
            <h4
              className="text-sm font-semibold uppercase tracking-wider border-b pb-2 mb-4 flex items-center gap-2"
              style={{ color: colors.textSecondary, borderColor: colors.border }}
            >
              <Store size={16} /> Store Information
            </h4>

            <div className="relative">
              <div className="absolute left-3 top-9" style={{ color: colors.textSecondary }}>
                <Store size={18} />
              </div>
              <Input
                label="Store Name"
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                required
                className="pl-10"
                placeholder="My Awesome Store"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-9" style={{ color: colors.textSecondary }}>
                <Image size={18} />
              </div>
              <Input
                label="Logo URL"
                type="url"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="pl-10"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-9" style={{ color: colors.textSecondary }}>
                <Link size={18} />
              </div>
              <Input
                label="Banner URL"
                type="url"
                name="bannerUrl"
                value={formData.bannerUrl}
                onChange={handleChange}
                className="pl-10"
                placeholder="https://example.com/banner.png"
              />
            </div>

            {/* Preview Area (Optional visual fluff) */}
            <div className="bg-gray-50 rounded-lg p-4 mt-8 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm italic">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo Preview" className="h-16 w-16 object-cover rounded-full border shadow-sm" onError={(e) => { e.target.style.display = 'none' }} />
              ) : (
                <span>Logo Preview will appear here</span>
              )}
            </div>

          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="min-w-[140px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Seller'
            )}
          </Button>
        </div>

      </Form>
    </Modal>
  );
}