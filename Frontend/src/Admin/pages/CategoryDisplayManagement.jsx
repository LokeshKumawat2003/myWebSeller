import React, { useState, useEffect } from 'react';
import { adminListCategoryDisplays, adminCreateCategoryDisplay, adminUpdateCategoryDisplay, adminDeleteCategoryDisplay } from '../../services/adminApi';
import CategoryDisplayHeader from '../components/CategoryDisplay/CategoryDisplayHeader';
import CategoryDisplayForm from '../components/CategoryDisplay/CategoryDisplayForm';
import CategoryDisplayTable from '../components/CategoryDisplay/CategoryDisplayTable';

export default function CategoryDisplayManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    active: true,
    position: 0
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminListCategoryDisplays();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        if (selectedImageFile) {
          const fd = new FormData();
          fd.append('image', selectedImageFile);
          fd.append('name', formData.name);
          fd.append('active', String(formData.active));
          fd.append('position', String(formData.position || 0));
          await adminUpdateCategoryDisplay(editingCategory._id, fd);
        } else {
          await adminUpdateCategoryDisplay(editingCategory._id, formData);
        }
        alert('Category updated successfully!');
      } else {
        if (selectedImageFile) {
          const fd = new FormData();
          fd.append('image', selectedImageFile);
          fd.append('name', formData.name);
          fd.append('active', String(formData.active));
          fd.append('position', String(formData.position || 0));
          await adminCreateCategoryDisplay(fd);
        } else {
          await adminCreateCategoryDisplay(formData);
        }
        alert('Category created successfully!');
      }
      loadCategories();
      resetForm();
    } catch (err) {
      alert('Error saving category: ' + err.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      image: category.image || '',
      active: category.active !== false,
      position: category.position || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await adminDeleteCategoryDisplay(categoryId);
        alert('Category deleted successfully!');
        loadCategories();
      } catch (err) {
        alert('Error deleting category: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      active: true,
      position: 0
    });
    setEditingCategory(null);
    setSelectedImageFile(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <CategoryDisplayHeader onAddNew={() => setShowForm(true)} />

      <CategoryDisplayForm
        showForm={showForm}
        editingCategory={editingCategory}
        formData={formData}
        onFormDataChange={setFormData}
        selectedImageFile={selectedImageFile}
        setSelectedImageFile={setSelectedImageFile}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

      <CategoryDisplayTable
        categories={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
