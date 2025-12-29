import React from 'react';
import { X } from 'lucide-react';
import ProductForm from './ProductForm';

const ProductFormModal = ({
  showForm,
  setShowForm,
  formData,
  setFormData,
  categories,
  availableSizes,
  availableColors,
  availableFits,
  imageInput,
  setImageInput,
  colorInput,
  setColorInput,
  sizeInput,
  setSizeInput,
  handleInputChange,
  handleAddImage,
  handleRemoveImage,
  handleColorInputChange,
  handleAddColorImage,
  handleRemoveColorImage,
  handleSizeInputChange,
  handleAddSize,
  handleRemoveSize,
  handleAddColor,
  handleRemoveColor,
  getUniqueSizesAndColors,
  findVariant,
  handleSubmit,
  loading,
  accountBlocked,
  seller,
  editingId,
  resetForm
}) => {
  if (!showForm) return null;

  const handleClose = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <ProductForm
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
            handleAddColor={handleAddColor}
            handleRemoveColor={handleRemoveColor}
            getUniqueSizesAndColors={getUniqueSizesAndColors}
            findVariant={findVariant}
            handleSubmit={(e) => {
              handleSubmit(e);
              if (!loading) handleClose();
            }}
            loading={loading}
            accountBlocked={accountBlocked}
            seller={seller}
            editingId={editingId}
            resetForm={resetForm}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;