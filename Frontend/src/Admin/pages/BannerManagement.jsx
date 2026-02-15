import React, { useState, useEffect } from 'react';
import { adminListBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner } from '../../services/adminApi';
import BannerHeader from '../components/Banner/BannerHeader';
import BannerForm from '../components/Banner/BannerForm';
import BannerTable from '../components/Banner/BannerTable';

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    active: true,
    position: 0
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await adminListBanners();
      setBanners(data);
    } catch (err) {
      console.error('Error loading banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        if (selectedImageFile) {
          const fd = new FormData();
          fd.append('image', selectedImageFile);
          fd.append('title', formData.title);
          fd.append('active', String(formData.active));
          fd.append('position', String(formData.position || 0));
          await adminUpdateBanner(editingBanner._id, fd);
        } else {
          await adminUpdateBanner(editingBanner._id, formData);
        }
        alert('Banner updated successfully!');
      } else {
        if (selectedImageFile) {
          const fd = new FormData();
          fd.append('image', selectedImageFile);
          fd.append('title', formData.title);
          fd.append('active', String(formData.active));
          fd.append('position', String(formData.position || 0));
          await adminCreateBanner(fd);
        } else {
          await adminCreateBanner(formData);
        }
        alert('Banner created successfully!');
      }
      loadBanners();
      resetForm();
    } catch (err) {
      alert('Error saving banner: ' + err.message);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      imageUrl: banner.imageUrl || '',

      active: banner.active !== false,
      position: banner.position || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner? This action cannot be undone.')) {
      try {
        await adminDeleteBanner(bannerId);
        alert('Banner deleted successfully!');
        loadBanners();
      } catch (err) {
        alert('Error deleting banner: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      imageUrl: '',
      active: true,
      position: 0
    });
    setEditingBanner(null);
    setSelectedImageFile(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <BannerHeader onAddNew={() => setShowForm(true)} />

      <BannerForm
        showForm={showForm}
        editingBanner={editingBanner}
        formData={formData}
        onFormDataChange={setFormData}
        selectedImageFile={selectedImageFile}
        setSelectedImageFile={setSelectedImageFile}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

      <BannerTable
        banners={banners}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}