import React, { useState, useEffect } from 'react';
import { sellerCreateProduct, sellerUpdateProduct, sellerDeleteProduct, listCategories } from '../../services/api';
import ProductFormModal from '../components/Products/ProductFormModal';
import ProductList from '../components/Products/ProductList';

export default function ProductManagement({ seller, products, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableFits, setAvailableFits] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    basePrice: '',
    discount: 0,
    category: '',
    clothingType: '',
    images: [],
    description: '',
    isNew: false,
    isTrending: false,
    isFeatured: false,
    variants: [], // Now array of color variants
  });
  const [editingStock, setEditingStock] = useState(null); // {variantIdx, sizeIdx, value}
  const [stockInputValue, setStockInputValue] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [colorInput, setColorInput] = useState({
    color: '',
    material: '',
    fit: '',
    images: [],
    colorImageInput: '',
    sizes: [],
  });
  const [sizeInput, setSizeInput] = useState({
    size: '',
    price: '',
    discount: '',
    stock: '',
    sku: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await listCategories();
      const cats = Array.isArray(data) ? data : [];
      setCategories(cats);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Update available sizes/colors/fits based on selected category or global attributes
  useEffect(() => {
    const selected = categories.find(c => String(c._id) === String(formData.category));
    const sizes = new Set();
    const colors = new Set();
    const fits = new Set();

    const collectFromAttrs = (attrs) => {
      if (!Array.isArray(attrs)) return;
      for (const a of attrs) {
        if (!a || !a.name) continue;
        const name = String(a.name).toLowerCase();
        if (Array.isArray(a.values) && a.values.length > 0) {
          // Match by attribute name: size/sizes -> sizes, color/colors -> colors, fit/fits -> fits
          if (name.includes('size')) {
            a.values.forEach(v => sizes.add(v));
          } else if (name.includes('color')) {
            a.values.forEach(v => colors.add(v));
          } else if (name.includes('fit')) {
            a.values.forEach(v => fits.add(v));
          } else {
            // If attribute name doesn't match size/color/fit, treat first attr as sizes, second as colors
            // This provides a fallback for custom attribute names
            if (sizes.size === 0) {
              a.values.forEach(v => sizes.add(v));
            } else if (colors.size === 0) {
              a.values.forEach(v => colors.add(v));
            } else if (fits.size === 0) {
              a.values.forEach(v => fits.add(v));
            }
          }
        }
      }
    };

    // If a category is selected, use its attributes
    if (selected && selected.attributes) {
      collectFromAttrs(selected.attributes);
    } else {
      // If no category selected, use union of ALL categories' attributes
      for (const c of categories) {
        if (c.attributes) collectFromAttrs(c.attributes);
      }
    }

    setAvailableSizes(Array.from(sizes).sort());
    setAvailableColors(Array.from(colors).sort());
    setAvailableFits(Array.from(fits).sort());
  }, [categories, formData.category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()],
      }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleColorInputChange = (e) => {
    const { name, value } = e.target;
    setColorInput(prev => ({ ...prev, [name]: value }));
  };

  const handleAddColorImage = () => {
    if (colorInput.colorImageInput.trim()) {
      const urls = colorInput.colorImageInput.split(',').map(url => url.trim()).filter(url => url);
      if (urls.length > 0) {
        setColorInput(prev => ({
          ...prev,
          images: [...prev.images, ...urls],
          colorImageInput: '',
        }));
      }
    }
  };

  const handleRemoveColorImage = (index) => {
    setColorInput(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSizeInputChange = (e) => {
    const { name, value } = e.target;
    setSizeInput(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSize = () => {
    if (sizeInput.size && sizeInput.price) {
      setColorInput(prev => ({
        ...prev,
        sizes: [...prev.sizes, {
          ...sizeInput,
          price: parseFloat(sizeInput.price) || 0,
          discount: parseFloat(sizeInput.discount) || 0,
          stock: parseInt(sizeInput.stock) || 0
        }],
      }));
      setSizeInput({
        size: '',
        price: '',
        discount: '',
        stock: '',
        sku: '',
      });
    } else {
      alert('Please enter size and price');
    }
  };

  const handleRemoveSize = (index) => {
    setColorInput(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleEditStock = (variantIdx, sizeIdx, currentStock) => {
    setEditingStock({ variantIdx, sizeIdx });
    setStockInputValue(currentStock.toString());
  };

  const handleSaveStock = () => {
    if (editingStock) {
      const { variantIdx, sizeIdx } = editingStock;
      const newStock = parseInt(stockInputValue) || 0;
      
      setFormData(prev => {
        const updatedVariants = [...prev.variants];
        if (updatedVariants[variantIdx] && updatedVariants[variantIdx].sizes[sizeIdx]) {
          updatedVariants[variantIdx].sizes[sizeIdx].stock = newStock;
        }
        return { ...prev, variants: updatedVariants };
      });
      
      setEditingStock(null);
      setStockInputValue('');
    }
  };

  const handleCancelStockEdit = () => {
    setEditingStock(null);
    setStockInputValue('');
  };

  const handleAddColor = () => {
    if (colorInput.color && colorInput.sizes.length > 0) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { ...colorInput }],
      }));
      setColorInput({
        color: '',
        material: '',
        fit: '',
        images: [],
        colorImageInput: '',
        sizes: [],
      });
    } else {
      alert('Please enter color and at least one size');
    }
  };

  const handleRemoveColor = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Helper: Extract unique sizes and colors from variants
  const getUniqueSizesAndColors = () => {
    const colors = new Set();
    const sizes = new Set();
    formData.variants.forEach(v => {
      if (v.color) colors.add(v.color);
      v.sizes.forEach(s => {
        if (s.size) sizes.add(s.size);
      });
    });
    return {
      sizes: Array.from(sizes).sort(),
      colors: Array.from(colors).sort(),
    };
  };

  // Helper: Find variant by color and size
  const findVariant = (color, size) => {
    const colorVariant = formData.variants.find(v => v.color === color);
    if (colorVariant) {
      return colorVariant.sizes.find(s => s.size === size);
    }
    return null;
  };

  // Helper: Get matrix for a given product
  const getProductMatrix = (product) => {
    const sizes = new Set();
    const colors = new Set();
    let totalStock = 0;
    if (product.variants) {
      product.variants.forEach(v => {
        if (v.color) colors.add(v.color);
        if (v.sizes && Array.isArray(v.sizes)) {
          v.sizes.forEach(s => {
            if (s.size) sizes.add(s.size);
            if (s.stock) totalStock += s.stock;
          });
        }
      });
    }
    return { sizes: Array.from(sizes).sort(), colors: Array.from(colors).sort(), totalStock };
  };

  const findProductVariant = (product, size, color) => {
    return product.variants?.find(v => v.size === size && v.color === color);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await sellerUpdateProduct(editingId, formData);
        alert('Product updated successfully!');
      } else {
        await sellerCreateProduct(formData);
        alert('Product created successfully!');
      }
      resetForm();
      onRefresh();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (product) => {
    // ensure we have latest categories (and their attributes) before showing the form
    await loadCategories();
    const normalized = { ...product };
    if (product.category && typeof product.category === 'object' && product.category._id) {
      normalized.category = product.category._id;
    } else if (product.category && typeof product.category === 'string') {
      normalized.category = product.category;
    } else {
      normalized.category = '';
    }
    // Ensure arrays are initialized
    normalized.images = normalized.images || [];
    normalized.variants = normalized.variants || [];
    // Ensure string fields
    normalized.title = normalized.title || '';
    normalized.description = normalized.description || '';
    normalized.basePrice = normalized.basePrice ? String(normalized.basePrice) : '';
    normalized.discount = normalized.discount ? Number(normalized.discount) : 0;
    normalized.clothingType = normalized.clothingType || '';
    // Ensure boolean fields
    normalized.isNew = Boolean(normalized.isNew);
    normalized.isTrending = Boolean(normalized.isTrending);
    normalized.isFeatured = Boolean(normalized.isFeatured);
    setFormData(normalized);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleToggleForm = async () => {
    if (!showForm) {
      await loadCategories();
      resetForm();
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await sellerDeleteProduct(id);
        alert('Product deleted successfully!');
        onRefresh();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      basePrice: '',
      baseDiscount: 0,
      category: '',
      clothingType: '',
      images: [],
      description: '',
      isNew: false,
      isTrending: false,
      isFeatured: false,
      variants: [],
    });
    setColorInput({
      color: '',
      material: '',
      fit: '',
      images: [],
      colorImageInput: '',
      sizes: [],
    });
    setSizeInput({
      size: '',
      price: '',
      discount: '',
      stock: '',
      sku: '',
    });
    setImageInput('');
    setEditingId(null);
    setEditingStock(null);
    setStockInputValue('');
    setShowForm(false);
  };

  const accountBlocked = seller?.blocked;
  const accountApproved = seller?.approved;

  return (
    <div className="space-y-6">
      {/* Seller account status banner */}
      {!seller && (
        <div className="p-6 bg-[#fbf7f2] text-[#3b3b3b] rounded-lg border border-[#e6ddd2] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#9c7c3a] rounded-full"></div>
            <p className="font-light italic font-serif">You don't have a seller profile yet. Request a seller account to list products.</p>
          </div>
        </div>
      )}
      {seller && accountBlocked && (
        <div className="p-6 bg-[#fbf7f2] text-[#3b3b3b] rounded-lg border border-[#e6ddd2] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#9c7c3a] rounded-full"></div>
            <p className="font-light italic font-serif">Your seller account has been blocked by the admin. You cannot create or edit products.</p>
          </div>
        </div>
      )}
      {seller && !accountBlocked && !accountApproved && (
        <div className="p-6 bg-[#fbf7f2] text-[#3b3b3b] rounded-lg border border-[#e6ddd2] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#9c7c3a] rounded-full"></div>
            <p className="font-light italic font-serif">Your seller account is pending approval. Products you create will be submitted as pending and visible after admin approval.</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-light italic text-[#3b3b3b] font-serif">Product Management</h1>
        <button
          onClick={handleToggleForm}
          className="px-6 py-3 bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] rounded-lg font-light italic transition-all disabled:cursor-not-allowed shadow-sm flex items-center gap-2 font-serif"
          disabled={accountBlocked || !seller}
        >
          <span>{showForm ? 'Cancel' : '+ Add New Product'}</span>
        </button>
      </div>

      {/* Form Modal */}
      <ProductFormModal
        showForm={showForm}
        setShowForm={setShowForm}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        availableSizes={availableSizes}
        availableColors={availableColors}
        availableFits={availableFits}
        imageInput={imageInput}
        setImageInput={setImageInput}
        colorInput={colorInput}
        setColorInput={setColorInput}
        sizeInput={sizeInput}
        setSizeInput={setSizeInput}
        handleInputChange={handleInputChange}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        handleColorInputChange={handleColorInputChange}
        handleAddColorImage={handleAddColorImage}
        handleRemoveColorImage={handleRemoveColorImage}
        handleSizeInputChange={handleSizeInputChange}
        handleAddSize={handleAddSize}
        handleRemoveSize={handleRemoveSize}
        handleEditStock={handleEditStock}
        handleSaveStock={handleSaveStock}
        handleCancelStockEdit={handleCancelStockEdit}
        editingStock={editingStock}
        stockInputValue={stockInputValue}
        setStockInputValue={setStockInputValue}
        handleAddColor={handleAddColor}
        handleRemoveColor={handleRemoveColor}
        getUniqueSizesAndColors={getUniqueSizesAndColors}
        findVariant={findVariant}
        handleSubmit={handleSubmit}
        loading={loading}
        accountBlocked={accountBlocked}
        seller={seller}
        editingId={editingId}
        resetForm={resetForm}
      />

      {/* Products List */}
      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        accountBlocked={accountBlocked}
        getProductMatrix={getProductMatrix}
        findProductVariant={findProductVariant}
      />
    </div>
  );
}
