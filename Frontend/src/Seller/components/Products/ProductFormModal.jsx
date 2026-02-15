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
  handleColorFilesSelected,
  handleSizeInputChange,
  handleAddSize,
  handleRemoveSize,
  handleEditStock,
  handleSaveStock,
  handleCancelStockEdit,
  editingStock,
  stockInputValue,
  setStockInputValue,
  handleAddColor,
  handleRemoveColor,
  getUniqueSizesAndColors,
  findVariant,
  handleSubmit,
  loading,
  accountBlocked,
  seller,
  editingId,
  resetForm,
  selectedFiles,
  setSelectedFiles
}) => {
  if (!showForm) return null;

  const handleClose = () => {
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#e6ddd2]">
        <div className="p-6 border-b border-[#e6ddd2] sticky top-0 bg-white rounded-t-lg flex justify-between items-center">
          <h2 className="text-2xl font-light italic text-[#3b3b3b] font-serif">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={handleClose}
            className="text-[#666] hover:text-[#3b3b3b] text-2xl p-1"
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
            handleColorFilesSelected={handleColorFilesSelected}
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
            handleSubmit={(e) => {
              handleSubmit(e);
              if (!loading) handleClose();
            }}
            loading={loading}
            accountBlocked={accountBlocked}
            seller={seller}
            editingId={editingId}
            resetForm={resetForm}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;