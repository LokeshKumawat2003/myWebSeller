# Category Display API Setup Guide

## Overview
A NEW API has been created for managing category displays with images. This is separate from the existing Category model and API to avoid conflicts. The CategoryDisplay model is specifically for the "SHOP BY CATEGORY" section on the homepage with image support.

## Backend Files Created

### 1. **Model** - `Backend/src/models/CategoryDisplay.js`
- New MongoDB model for category displays
- Fields:
  - `name`: Category name (required, unique)
  - `slug`: Auto-generated URL slug
  - `image`: Image URL (Cloudinary)
  - `position`: Display order
  - `active`: Show/hide toggle

### 2. **Controller** - `Backend/src/controllers/categoryDisplayController.js`
- `listCategoryDisplays()`: Get active categories (public)
- `getAllCategoryDisplays()`: Get all categories (admin only)
- `createCategoryDisplay()`: Create with image upload
- `updateCategoryDisplay()`: Update with optional new image
- `getCategoryDisplay()`: Get single category
- `deleteCategoryDisplay()`: Delete category

### 3. **Routes** - `Backend/src/routes/categoryDisplay.js`
```
GET    /category-display              → listCategoryDisplays (public)
GET    /category-display/:id          → getCategoryDisplay (public)
GET    /category-display/admin/all    → getAllCategoryDisplays (admin)
POST   /category-display              → createCategoryDisplay (admin)
PUT    /category-display/:id          → updateCategoryDisplay (admin)
DELETE /category-display/:id          → deleteCategoryDisplay (admin)
```

### 4. **Integration** - `Backend/src/index.js`
- Added route: `app.use('/category-display', require('./routes/categoryDisplay'));`

## Frontend Files Created

### 5. **API Service** - `Frontend/src/services/api.js`
- Added: `getCategoryDisplays()` - Public function to fetch active categories

### 6. **Admin API Service** - `Frontend/src/services/adminApi.js`
- `adminListCategoryDisplays()` - Fetch all categories
- `adminCreateCategoryDisplay()` - Create with image
- `adminUpdateCategoryDisplay()` - Update with image
- `adminDeleteCategoryDisplay()` - Delete

### 7. **Admin Components**
- **Page**: `Frontend/src/Admin/pages/CategoryDisplayManagement.jsx`
  - Full CRUD management interface
  - Image upload support
  
- **Components** (in `Frontend/src/Admin/components/CategoryDisplay/`):
  - `CategoryDisplayHeader.jsx` - Header with "Add New" button
  - `CategoryDisplayForm.jsx` - Form for create/edit with image upload
  - `CategoryDisplayTable.jsx` - Table showing all categories

### 8. **Frontend Component** - `Frontend/src/components/ShopByCategory.jsx`
- Displays the "SHOP BY CATEGORY" section
- Fetches data from new API
- Shows 4-column grid (2 on mobile)
- Image hover effects

### 9. **Admin Dashboard Integration**
- **Sidebar**: Added "Category Display" menu item
- **Dashboard**: Integrated CategoryDisplayManagement component

## How to Use

### Admin Panel
1. Go to Admin Dashboard
2. Click "Category Display" in sidebar
3. Click "Add New Category"
4. Fill in:
   - Category Name (e.g., "Men", "Women", "Sneakers")
   - Upload image or enter image URL
   - Set position order
   - Toggle active/inactive
5. Click "Create Category"

### Frontend Display
1. Import `ShopByCategory` component in your main page
2. The component:
   - Fetches active categories from `/category-display`
   - Displays them in a grid layout
   - Shows category name and image
   - Links to category pages

## API Endpoints Summary

### Public Endpoints
```
GET /category-display
Response: [
  {
    _id: "...",
    name: "Women",
    slug: "women",
    image: "https://...",
    position: 0,
    active: true
  }
]
```

### Admin Endpoints
```
GET    /category-display/admin/all
POST   /category-display
PUT    /category-display/:id
DELETE /category-display/:id
```

## Image Upload
- Uses Cloudinary via multer (same as banners)
- Supports JPG, PNG, WebP formats
- Can upload file or provide URL

## The Original Category API Still Works
- `/categories` endpoint is unchanged
- Use for product categories with attributes (Size, Color, etc.)
- This new API is specifically for display/navigation

## Key Differences from Original Category API

| Feature | Original Category | New CategoryDisplay |
|---------|-------------------|-------------------|
| Purpose | Product attributes | Homepage display |
| Image | Not included | Image URL required |
| Attributes | Size, Color, Fit | Not applicable |
| Position | Not used | For display order |
| Use Case | Product filtering | "Shop by Category" section |

## Next Steps
1. Start backend server: `npm start`
2. Admin can add categories via dashboard
3. Frontend automatically displays via ShopByCategory component
4. Categories are sorted by position field
