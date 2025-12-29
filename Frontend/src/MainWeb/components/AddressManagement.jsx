import React, { useState, useEffect } from 'react';
import { getUserAddresses, addUserAddress, updateUserAddress, deleteUserAddress, getAuthToken } from '../../services/api';
import { MapPin, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

const AddressManagement = ({ selectedAddress, onAddressSelect, onClose }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    isDefault: false
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      console.log('Token available:', !!token);
      
      if (token) {
        console.log('Fetching addresses...');
        const data = await getUserAddresses(token);
        console.log('Addresses data:', data);
        setAddresses(data.addresses || []);
      } else {
        console.log('No token available');
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      if (editingAddress) {
        await updateUserAddress(editingAddress._id, formData, token);
      } else {
        await addUserAddress(formData, token);
      }
      await loadAddresses();
      resetForm();
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name || '',
      phone: address.phone || '',
      line1: address.line1 || '',
      line2: address.line2 || '',
      city: address.city || '',
      state: address.state || '',
      country: address.country || 'India',
      pincode: address.pincode || '',
      isDefault: address.isDefault || false
    });
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const token = getAuthToken();
      await deleteUserAddress(addressId, token);
      await loadAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      isDefault: false
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  const handleAddressSelect = (address) => {
    onAddressSelect(address);
    onClose();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9c7c3a]"></div>
      </div>
    );
  }

  // Check if user is logged in
  const token = getAuthToken();
  if (!token) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-medium text-[#9c7c3a] tracking-[2px]">
            Manage Addresses
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#3b3b3b]/60 hover:text-[#3b3b3b] hover:bg-[#e6ddd2] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-[#e6ddd2] mx-auto mb-4" />
          <h3 className="text-xl font-serif font-medium text-[#9c7c3a] mb-2">Login Required</h3>
          <p className="text-[#3b3b3b]/70 font-sans mb-4">Please log in to manage your addresses.</p>
          <button
            onClick={() => {
              onClose();
              // You might want to redirect to login page here
              window.location.href = '/login';
            }}
            className="bg-[#9c7c3a] text-white px-6 py-2 rounded-lg hover:bg-[#8a6a2f] transition-colors font-sans font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-medium text-[#9c7c3a] tracking-[2px]">
          Manage Addresses
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-[#3b3b3b]/60 hover:text-[#3b3b3b] hover:bg-[#e6ddd2] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {addresses.length > 0 ? addresses.map((address) => (
          <div
            key={address._id}
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedAddress && selectedAddress._id === address._id
                ? 'border-[#9c7c3a] bg-[#9c7c3a]/5'
                : 'border-[#e6ddd2] hover:border-[#9c7c3a]/50'
            }`}
            onClick={() => handleAddressSelect(address)}
          >
            {address.isDefault && (
              <span className="absolute top-2 right-2 bg-[#9c7c3a] text-white text-xs px-2 py-1 rounded">
                Default
              </span>
            )}

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[#9c7c3a] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-serif font-medium text-[#3b3b3b]">{address.name}</h3>
                <p className="text-sm text-[#3b3b3b]/70 mt-1">{address.phone}</p>
                <p className="text-sm text-[#3b3b3b]/70 mt-1">
                  {address.line1}
                  {address.line2 && `, ${address.line2}`}
                </p>
                <p className="text-sm text-[#3b3b3b]/70">
                  {address.city}, {address.state} {address.pincode}
                </p>
                {address.country && (
                  <p className="text-sm text-[#3b3b3b]/70">{address.country}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e6ddd2]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(address);
                }}
                className="flex items-center space-x-1 text-[#9c7c3a] hover:text-[#8a6a2f] text-sm"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(address._id);
                }}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-8">
            <MapPin className="w-16 h-16 text-[#e6ddd2] mx-auto mb-4" />
            <h3 className="text-lg font-serif font-medium text-[#9c7c3a] mb-2">No addresses found</h3>
            <p className="text-[#3b3b3b]/70 font-sans mb-4">Add your first address to get started with faster checkout.</p>
          </div>
        )}
      </div>

      {/* Add New Address Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full md:w-auto flex items-center justify-center space-x-2 bg-[#9c7c3a] text-white px-6 py-3 rounded-lg hover:bg-[#8a6a2f] transition-colors font-sans font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Address</span>
        </button>
      )}

      {/* Address Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-[#e6ddd2] mt-6">
          <h3 className="text-lg font-serif font-medium text-[#9c7c3a] mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-serif font-medium text-[#3b3b3b] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6ddd2] rounded focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-serif font-medium text-[#3b3b3b] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6ddd2] rounded focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-serif font-medium text-[#3b3b3b] mb-1">
                Address Line 1 *
              </label>
              <input
                type="text"
                value={formData.line1}
                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                placeholder="Street address, building, apartment"
                className="w-full px-3 py-2 border border-[#e6ddd2] rounded focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-serif font-medium text-[#3b3b3b] mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.line2}
                onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                placeholder="Landmark, area (optional)"
                className="w-full px-3 py-2 border border-[#e6ddd2] rounded focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-serif font-medium text-[#3b3b3b] mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6ddd2] rounded focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-serif font-medium text-[#3b3b3b] mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6ddd2] rounded focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-serif font-medium text-[#3b3b3b] mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6ddd2] rounded focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded border-[#e6ddd2] text-[#9c7c3a] focus:ring-[#9c7c3a]"
              />
              <label htmlFor="isDefault" className="text-sm text-[#3b3b3b]">
                Set as default address
              </label>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-[#9c7c3a] text-white px-6 py-2 rounded hover:bg-[#8a6a2f] transition-colors font-sans font-medium"
              >
                <Check className="w-4 h-4" />
                <span>{editingAddress ? 'Update Address' : 'Save Address'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-sans font-medium"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddressManagement;