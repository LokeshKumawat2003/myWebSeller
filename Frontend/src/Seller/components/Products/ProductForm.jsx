import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

const ProductForm = ({ 
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
  
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Product Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter product title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={accountBlocked || !seller}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Base Price</label>
              <input
                type="number"
                name="basePrice"
                placeholder="0.00"
                value={formData.basePrice}
                onChange={handleInputChange}
                step="0.01"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={accountBlocked || !seller}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Base Discount (%)</label>
              <input
                type="number"
                name="discount"
                placeholder="0"
                value={formData.discount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={accountBlocked || !seller}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all"
                disabled={accountBlocked || !seller}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Clothing Type (Optional)</label>
              <select
                name="clothingType"
                value={formData.clothingType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white transition-all"
                disabled={accountBlocked || !seller}
              >
                <option value="">Not clothing</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                disabled={accountBlocked || !seller}
              />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Product Images
          </h3>
          
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Enter image URL"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={accountBlocked || !seller}
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
              disabled={accountBlocked || !seller}
            >
              Add Image
            </button>
          </div>

          {formData.images && formData.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`product ${idx + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📷</div>
              <p>No images added yet</p>
            </div>
          )}
        </div>

        {/* Variants Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Variants (Colors & Sizes)
          </h3>

          {/* Add Color Section */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Color Variant</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <input
                  type="text"
                  name="color"
                  placeholder="e.g., Red, Blue"
                  value={colorInput.color}
                  onChange={handleColorInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={accountBlocked || !seller}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Material</label>
                <input
                  type="text"
                  placeholder="e.g., Cotton, Polyester"
                  name="material"
                  value={colorInput.material}
                  onChange={handleColorInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={accountBlocked || !seller}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Fit</label>
                {availableFits.length > 0 ? (
                  <select
                    name="fit"
                    value={colorInput.fit}
                    onChange={handleColorInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all"
                    disabled={accountBlocked || !seller}
                  >
                    <option value="">Select fit</option>
                    {availableFits.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g., Slim, Regular, Loose"
                    name="fit"
                    value={colorInput.fit}
                    onChange={handleColorInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    disabled={accountBlocked || !seller}
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Color Images</label>
                <input
                  type="text"
                  placeholder="Enter image URLs separated by commas"
                  name="colorImageInput"
                  value={colorInput.colorImageInput}
                  onChange={handleColorInputChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddColorImage();
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={accountBlocked || !seller}
                />
                <button
                  type="button"
                  onClick={handleAddColorImage}
                  className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
                  disabled={!colorInput.colorImageInput.trim() || accountBlocked || !seller}
                >
                  Add Images
                </button>
              </div>
            </div>

            {colorInput.images && colorInput.images.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {colorInput.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`color ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveColorImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Size Section */}
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <h5 className="text-md font-semibold text-gray-900 mb-4">Add Sizes for this Color</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <select
                    name="size"
                    value={sizeInput.size}
                    onChange={handleSizeInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all"
                    disabled={accountBlocked || !seller}
                  >
                    <option value="">Select size</option>
                    {availableSizes.length > 0 ? (
                      availableSizes.map(s => <option key={s} value={s}>{s}</option>)
                    ) : (
                      <option value="">No sizes available</option>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    name="price"
                    value={sizeInput.price}
                    onChange={handleSizeInputChange}
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={accountBlocked || !seller}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                  <input
                    type="number"
                    placeholder="0"
                    name="discount"
                    value={sizeInput.discount}
                    onChange={handleSizeInputChange}
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={accountBlocked || !seller}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    placeholder="0"
                    name="stock"
                    value={sizeInput.stock}
                    onChange={handleSizeInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={accountBlocked || !seller}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">SKU</label>
                  <input
                    type="text"
                    placeholder="e.g., PROD-RED-M"
                    name="sku"
                    value={sizeInput.sku}
                    onChange={handleSizeInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={accountBlocked || !seller}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddSize}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
                disabled={accountBlocked || !seller}
              >
                + Add Size
              </button>

              {colorInput.sizes && colorInput.sizes.length > 0 && (
                <div className="mt-4">
                  <h6 className="text-sm font-semibold text-gray-900 mb-2">Sizes for {colorInput.color || 'this color'}:</h6>
                  <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-r border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-900">Size</th>
                          <th className="border-r border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-900">Price</th>
                          <th className="border-r border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-900">Discount</th>
                          <th className="border-r border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-900">Stock</th>
                          <th className="border-r border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-900">SKU</th>
                          <th className="px-3 py-2 text-center text-xs font-semibold text-gray-900">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {colorInput.sizes.map((s, idx) => (
                          <tr key={idx} className="border-t border-gray-200">
                            <td className="border-r border-gray-200 px-3 py-2 text-gray-900 text-sm">{s.size}</td>
                            <td className="border-r border-gray-200 px-3 py-2 text-gray-900 text-sm">${s.price}</td>
                            <td className="border-r border-gray-200 px-3 py-2 text-gray-900 text-sm">{s.discount}%</td>
                            <td className="border-r border-gray-200 px-3 py-2 text-gray-900 text-sm font-semibold">{s.stock}</td>
                            <td className="border-r border-gray-200 px-3 py-2 text-gray-900 text-sm">{s.sku}</td>
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveSize(idx)}
                                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition-colors"
                                disabled={accountBlocked || !seller}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddColor}
              className="mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
              disabled={accountBlocked || !seller}
            >
              + Add Color Variant
            </button>
          </div>

          {formData.variants && formData.variants.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">All Color Variants</h4>
              {formData.variants.map((colorVariant, colorIdx) => (
                <div key={colorIdx} className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-md font-semibold text-gray-900">{colorVariant.color}</h5>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(colorIdx)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                      disabled={accountBlocked || !seller}
                    >
                      Remove Color
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Material:</span>
                      <span className="ml-2 text-gray-900">{colorVariant.material || '-'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Fit:</span>
                      <span className="ml-2 text-gray-900">{colorVariant.fit || '-'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Images:</span>
                      <span className="ml-2 text-gray-900">{colorVariant.images?.length || 0} images</span>
                    </div>
                  </div>

                  {colorVariant.images && colorVariant.images.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {colorVariant.images.slice(0, 4).map((img, imgIdx) => (
                          <img
                            key={imgIdx}
                            src={img}
                            alt={`${colorVariant.color} ${imgIdx + 1}`}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                          />
                        ))}
                        {colorVariant.images.length > 4 && (
                          <span className="text-xs text-gray-500 self-center">+{colorVariant.images.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border-r border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-900">Size</th>
                          <th className="border-r border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-900">Price</th>
                          <th className="border-r border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-900">Discount</th>
                          <th className="border-r border-gray-200 px-3 py-2 text-left text-xs font-semibold text-gray-900">Stock</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-900">SKU</th>
                        </tr>
                      </thead>
                      <tbody>
                        {colorVariant.sizes.map((size, sizeIdx) => (
                          <tr key={sizeIdx} className="border-t border-gray-200">
                            <td className="border-r border-gray-200 px-3 py-2 text-gray-900 text-sm">{size.size}</td>
                            <td className="border-r border-gray-200 px-3 py-2 text-gray-900 text-sm">${size.price}</td>
                            <td className="border-r border-gray-200 px-3 py-2 text-gray-900 text-sm">{size.discount}%</td>
                            <td className="border-r border-gray-200 px-3 py-2 text-gray-900 text-sm font-semibold">{size.stock}</td>
                            <td className="px-3 py-2 text-gray-900 text-sm">{size.sku}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Product Tags
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                disabled={accountBlocked || !seller}
              />
              <span className="text-sm font-medium text-gray-700">New</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
              <input
                type="checkbox"
                name="isTrending"
                checked={formData.isTrending}
                onChange={(e) => setFormData(prev => ({ ...prev, isTrending: e.target.checked }))}
                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                disabled={accountBlocked || !seller}
              />
              <span className="text-sm font-medium text-gray-700">Trending</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                disabled={accountBlocked || !seller}
              />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || accountBlocked || !seller}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-purple-300 disabled:to-purple-400 text-white rounded-lg font-semibold transition-all disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;