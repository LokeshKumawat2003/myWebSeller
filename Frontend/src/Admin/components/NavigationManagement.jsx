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
import { Button, Input, Checkbox, Card } from './UI';

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Menu className="w-6 h-6 text-[#9c7c3a]" />
          <h1 className="text-xl sm:text-2xl font-serif font-medium text-[#9c7c3a]">Navigation Management</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setShowForm(true)}
            variant="primary"
            size="medium"
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Navigation
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-lg font-serif font-medium luxury-accent mb-4">
            {editingItem ? 'Edit Navigation' : 'Add Navigation'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Slug"
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
              <Input
                label="Order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
              <div className="flex items-center">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  label="Active"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                size="medium"
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingItem ? 'Update Navigation' : 'Create Navigation'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                variant="secondary"
                size="medium"
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading && !navigations.length ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin luxury-accent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="luxury-bg-secondary luxury-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium luxury-text-secondary uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium luxury-text-secondary uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium luxury-text-secondary uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium luxury-text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium luxury-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y luxury-border">
                {navigations.map((item) => (
                  <tr key={item._id} className="hover:luxury-bg-secondary">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium luxury-accent">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm luxury-text-primary">{item.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm luxury-text-primary">{item.order}</td>
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
                <Menu className="w-12 h-12 luxury-text-secondary mx-auto mb-4" />
                <p className="luxury-text-primary font-sans">No navigation items found</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default NavigationManagement;