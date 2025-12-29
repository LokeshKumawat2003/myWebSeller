import React, { useState, useEffect } from 'react';
import { adminListCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory, adminSeedCategories } from '../../services/adminApi';
import CategoryHeader from '../components/Category/CategoryHeader';
import CategoryForm from '../components/Category/CategoryForm';
import CategoriesTable from '../components/Category/CategoriesTable';
import CategoryInfo from '../components/Category/CategoryInfo';
import { CategoryLoadingState, CategoryEmptyState } from '../components/Category/CategoryStates';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sizeValues: '', // comma-separated sizes (e.g., "S,M,L,XL")
    colorValues: '', // comma-separated colors
    fitValues: '', // comma-separated fits
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminListCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Convert form data to attributes array for API
  const buildAttributesArray = () => {
    const attrs = [];
    if (formData.sizeValues.trim()) {
      attrs.push({
        name: 'size',
        values: formData.sizeValues.split(',').map(v => v.trim()).filter(Boolean),
      });
    }
    if (formData.colorValues.trim()) {
      attrs.push({
        name: 'color',
        values: formData.colorValues.split(',').map(v => v.trim()).filter(Boolean),
      });
    }
    if (formData.fitValues.trim()) {
      attrs.push({
        name: 'fit',
        values: formData.fitValues.split(',').map(v => v.trim()).filter(Boolean),
      });
    }
    return attrs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        attributes: buildAttributesArray(),
      };
      if (editingId) {
        await adminUpdateCategory(editingId, payload);
        alert('Category updated successfully!');
      } else {
        await adminCreateCategory(payload);
        alert('Category created successfully!');
      }
      resetForm();
      loadCategories();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (category) => {
    // Convert attributes array back to form fields
    const sizeAttr = (category.attributes || []).find(a => a.name === 'size');
    const colorAttr = (category.attributes || []).find(a => a.name === 'color');
    const fitAttr = (category.attributes || []).find(a => a.name === 'fit');
    setFormData({
      name: category.name,
      description: category.description || '',
      sizeValues: (sizeAttr?.values || []).join(', '),
      colorValues: (colorAttr?.values || []).join(', '),
      fitValues: (fitAttr?.values || []).join(', '),
    });
    setEditingId(category._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await adminDeleteCategory(id);
        alert('Category deleted successfully!');
        loadCategories();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  const handleSeedCategories = async () => {
    if (window.confirm('This will create the basic categories (Men, Women, Sneakers) if they don\'t already exist. Continue?')) {
      try {
        const result = await adminSeedCategories();
        alert(`Categories seeded successfully!\nCreated: ${result.created?.length || 0}\nAlready existed: ${result.existing?.length || 0}`);
        loadCategories();
      } catch (err) {
        alert('Error seeding categories: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sizeValues: '',
      colorValues: '',
      fitValues: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <CategoryHeader
        onAddNew={() => setShowForm(!showForm)}
        onSeedCategories={handleSeedCategories}
      />

      <CategoryInfo />

      <CategoryForm
        showForm={showForm}
        editingId={editingId}
        formData={formData}
        formLoading={formLoading}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

      {loading ? (
        <CategoryLoadingState />
      ) : categories.length === 0 ? (
        <CategoryEmptyState />
      ) : (
        <CategoriesTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
