import React, { useState, useEffect } from 'react';
import { adminGetAllProducts, adminUpdateProductStatus, adminBlockProduct, adminUnblockProduct, adminDeleteProduct, adminToggleFeatured, adminToggleTrending, adminToggleNew } from '../../services/adminApi';
import ProductHeader from '../components/Product/ProductHeader';
import ProductStats from '../components/Product/ProductStats';
import ProductFilters from '../components/Product/ProductFilters';
import ProductTable from '../components/Product/ProductTable';
import ProductModal from '../components/Product/ProductModal';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(''); // filter by status: all, draft, pending, approved, rejected
  const [selectedStatus, setSelectedStatus] = useState({}); // { [productId]: newStatus }
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminGetAllProducts();
      setProducts(Array.isArray(data?.products) ? data.products : []);
    } catch (err) {
      console.error('Error loading products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    if (!statusFilter) return products;
    return products.filter(p => p.status === statusFilter);
  };

  const handleStatusChange = (productId, newStatus) => {
    setSelectedStatus(prev => ({ ...prev, [productId]: newStatus }));
  };

  const handleApplyStatus = async (productId) => {
    const newStatus = selectedStatus[productId];
    if (!newStatus) return alert('Select a status first');
    try {
      await adminUpdateProductStatus(productId, newStatus);
      alert('Product status updated!');
      loadProducts();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleBlockProduct = async (productId) => {
    try {
      await adminBlockProduct(productId);
      alert('Product blocked!');
      loadProducts();
    } catch (err) {
      alert('Error blocking product: ' + err.message);
    }
  };

  const handleUnblockProduct = async (productId) => {
    try {
      await adminUnblockProduct(productId);
      alert('Product unblocked!');
      loadProducts();
    } catch (err) {
      alert('Error unblocking product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminDeleteProduct(productId);
        alert('Product deleted!');
        loadProducts();
      } catch (err) {
        alert('Error deleting product: ' + err.message);
      }
    }
  };

  const handleToggleFeatured = async (productId) => {
    try {
      await adminToggleFeatured(productId);
      alert('Featured status updated!');
      loadProducts();
    } catch (err) {
      alert('Error updating featured status: ' + err.message);
    }
  };

  const handleToggleTrending = async (productId) => {
    try {
      await adminToggleTrending(productId);
      alert('Trending status updated!');
      loadProducts();
    } catch (err) {
      alert('Error updating trending status: ' + err.message);
    }
  };

  const handleToggleNew = async (productId) => {
    try {
      await adminToggleNew(productId);
      alert('New status updated!');
      loadProducts();
    } catch (err) {
      alert('Error updating new status: ' + err.message);
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="space-y-6">
      <ProductHeader
        total={products.length}
        approved={products.filter(p => p.status === 'approved').length}
        pending={products.filter(p => p.status === 'pending').length}
        draft={products.filter(p => p.status === 'draft').length}
        rejected={products.filter(p => p.status === 'rejected').length}
      />

      <ProductStats
        total={products.length}
        approved={products.filter(p => p.status === 'approved').length}
        pending={products.filter(p => p.status === 'pending').length}
        draft={products.filter(p => p.status === 'draft').length}
        rejected={products.filter(p => p.status === 'rejected').length}
      />

      <ProductFilters
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <ProductTable
        products={filteredProducts}
        loading={loading}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        onApplyStatus={handleApplyStatus}
        onBlockProduct={handleBlockProduct}
        onUnblockProduct={handleUnblockProduct}
        onDeleteProduct={handleDeleteProduct}
        onToggleFeatured={handleToggleFeatured}
        onToggleTrending={handleToggleTrending}
        onToggleNew={handleToggleNew}
        onViewProduct={handleViewProduct}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
