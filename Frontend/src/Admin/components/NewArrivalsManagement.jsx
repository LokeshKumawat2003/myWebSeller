import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  GripVertical,
  Zap,
  Package
} from 'lucide-react';
import {
  adminListNewArrivals,
  adminAddToNewArrivals,
  adminRemoveFromNewArrivals,
  adminUpdateNewArrivalOrder,
  adminGetAllProducts
} from '../../services/adminApi';

const NewArrivalsManagement = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [arrivalsData, productsData] = await Promise.all([
        adminListNewArrivals(),
        adminGetAllProducts()
      ]);

      setNewArrivals(arrivalsData.newArrivals || []);
      // Filter approved products not already in new arrivals
      const existingIds = new Set((arrivalsData.newArrivals || []).map(na => na.product?._id));
      const available = (productsData.products || []).filter(p =>
        p.status === 'approved' && !p.isBlocked && !existingIds.has(p._id)
      );
      setAvailableProducts(available);
    } catch (err) {
      console.error('Error loading new arrivals data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productId) => {
    setActionLoading(productId);
    try {
      await adminAddToNewArrivals(productId);
      setShowAddModal(false);
      setSelectedProduct('');
      await loadData();
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Error adding product: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveProduct = async (productId) => {
    setActionLoading(productId);
    try {
      await adminRemoveFromNewArrivals(productId);
      await loadData();
    } catch (err) {
      console.error('Error removing product:', err);
      alert('Error removing product: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReorder = async (productId, direction) => {
    const currentIndex = newArrivals.findIndex(na => na.product?._id === productId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= newArrivals.length) return;

    const newArrivalsCopy = [...newArrivals];
    [newArrivalsCopy[currentIndex], newArrivalsCopy[newIndex]] =
      [newArrivalsCopy[newIndex], newArrivalsCopy[currentIndex]];

    // Update orders
    try {
      await Promise.all(
        newArrivalsCopy.map((na, index) =>
          adminUpdateNewArrivalOrder(na.product._id, index)
        )
      );
      setNewArrivals(newArrivalsCopy);
    } catch (err) {
      console.error('Error reordering:', err);
      alert('Error reordering products: ' + err.message);
      await loadData(); // Reload on error
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-3" />
          <p className="text-gray-600">Loading new arrivals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">New Arrivals Management</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {newArrivals.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium luxury-text-primary mb-2 italic">No New Arrivals</h3>
            <p className="luxury-text-secondary italic">Add products to showcase in the search modal</p>
          </div>
        ) : (
          newArrivals.map((arrival, index) => (
            <div
              key={arrival._id}
              className="flex items-center gap-4 p-4 luxury-border rounded-lg luxury-bg hover:bg-luxury-bg-secondary transition-colors"
            >
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
              </div>

              <img
                src={arrival.product?.images?.[0] || '/placeholder-product.png'}
                alt={arrival.product?.title}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />

              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{arrival.product?.title}</h4>
                <p className="text-sm text-gray-600">
                  Seller: {arrival.product?.seller?.storeName || 'N/A'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReorder(arrival.product._id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move Up"
                >
                  ▲
                </button>
                <button
                  onClick={() => handleReorder(arrival.product._id, 'down')}
                  disabled={index === newArrivals.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move Down"
                >
                  ▼
                </button>
                <button
                  onClick={() => handleRemoveProduct(arrival.product._id)}
                  disabled={actionLoading === arrival.product._id}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Remove from New Arrivals"
                >
                  {actionLoading === arrival.product._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Add Product to New Arrivals</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {availableProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium luxury-text-primary mb-2 italic">No Available Products</h4>
                  <p className="luxury-text-secondary italic">All approved products are already in new arrivals</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableProducts.map(product => (
                    <div
                      key={product._id}
                      className="luxury-border rounded-lg overflow-hidden hover:shadow-md transition-shadow luxury-bg"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={product.images?.[0] || '/placeholder-product.png'}
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-4">
                        <h4 className="font-medium luxury-text-primary mb-2 line-clamp-2 italic">
                          {product.title}
                        </h4>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-semibold luxury-accent">
                            ${product.basePrice}
                          </span>
                          <span className="text-sm luxury-text-secondary">
                            {product.seller?.storeName || 'Unknown Seller'}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddProduct(product._id)}
                          disabled={actionLoading === product._id}
                          className="w-full px-4 py-2 luxury-accent hover:bg-luxury-accent text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {actionLoading === product._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Add to New Arrivals
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewArrivalsManagement;