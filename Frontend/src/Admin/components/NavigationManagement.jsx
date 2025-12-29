import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Menu
} from 'lucide-react';
import {
  adminListNavigations,
  adminCreateNavigation,
  adminUpdateNavigation,
  adminDeleteNavigation,
} from '../../services/adminApi';

const NavigationManagement = () => {
  const [navigations, setNavigations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    loadNavigations();
  }, []);

  const loadNavigations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminListNavigations();
      setNavigations(data);
    } catch (err) {
      console.error('Error loading navigations:', err);
      setError('Failed to load navigations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editingItem) {
        await adminUpdateNavigation(editingItem._id, formData);
      } else {
        await adminCreateNavigation(formData);
      }
      await loadNavigations();
      setShowForm(false);
      setEditingItem(null);
      setFormData({ name: '', slug: '', order: 0, isActive: true });
    } catch (err) {
      console.error('Error saving navigation:', err);
      setError('Failed to save navigation');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      order: item.order,
      isActive: item.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return;
    setLoading(true);
    try {
      await adminDeleteNavigation(id);
      await loadNavigations();
    } catch (err) {
      console.error('Error deleting navigation:', err);
      setError('Failed to delete navigation');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ name: '', slug: '', order: 0, isActive: true });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Menu className="w-6 h-6 text-[#9c7c3a]" />
          <h1 className="text-2xl font-serif font-medium text-[#9c7c3a]">Navigation Management</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              try {
                await adminSeedNavigations();
                await loadNavigations();
              } catch (err) {
                setError('Failed to seed navigations');
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Seed Navigations
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#9c7c3a] text-white rounded-lg hover:bg-[#8a6a2f] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Navigation
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-6 bg-white border border-[#e6ddd2] rounded-lg">
          <h2 className="text-lg font-serif font-medium text-[#9c7c3a] mb-4">
            {editingItem ? 'Edit Navigation' : 'Add Navigation'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3b3b3b] mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6ddd2] rounded-lg focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3b3b3b] mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6ddd2] rounded-lg focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3b3b3b] mb-1">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-[#e6ddd2] rounded-lg focus:ring-2 focus:ring-[#9c7c3a] focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded border-[#e6ddd2] text-[#9c7c3a] focus:ring-[#9c7c3a]"
                  />
                  <span className="text-sm font-medium text-[#3b3b3b]">Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-[#9c7c3a] text-white rounded-lg hover:bg-[#8a6a2f] transition-colors disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingItem ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-[#e6ddd2] text-[#3b3b3b] rounded-lg hover:bg-[#fbf7f2] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-[#e6ddd2] rounded-lg overflow-hidden">
        {loading && !navigations.length ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#9c7c3a]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#fbf7f2] border-b border-[#e6ddd2]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#3b3b3b] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#3b3b3b] uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#3b3b3b] uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#3b3b3b] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#3b3b3b] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6ddd2]">
                {navigations.map((item) => (
                  <tr key={item._id} className="hover:bg-[#fbf7f2]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#9c7c3a]">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3b3b3b]">{item.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3b3b3b]">{item.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-[#9c7c3a] hover:text-[#8a6a2f] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {navigations.length === 0 && !loading && (
              <div className="text-center py-12">
                <Menu className="w-12 h-12 text-[#e6ddd2] mx-auto mb-4" />
                <p className="text-[#3b3b3b] font-sans">No navigation items found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationManagement;