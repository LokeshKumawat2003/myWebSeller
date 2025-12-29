# Clothing E-Commerce Backend (Full Scaffold)

A complete, production-ready Node.js/Express + MongoDB backend for a dynamic multi-seller e-commerce clothing platform. Supports customers, sellers, admins, product management, orders, payments, reviews, cart/wishlist, and more.

## Quick Start

### 1. Install dependencies

```powershell
cd Backend
npm install
```

### 2. Set up environment

The `.env` file is included with default values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/clothing_store
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

**Change `JWT_SECRET` and `MONGO_URI` in production.**

### 3. Start MongoDB

Ensure MongoDB is running locally (or update `MONGO_URI` to your hosted instance):
```powershell
# If MongoDB is installed locally, start it
mongod
```

### 4. Run the server

```powershell
npm run dev
```

Server should start at `http://localhost:5000`.

---

## API Endpoints Overview

### Authentication
- `POST /auth/register` — Register user/seller
- `POST /auth/login` — Login and get JWT token

### Products
- `GET /products` — List all approved products (pagination, filtering, sorting)
- `GET /products/:id` — Get product details
- `POST /products` — Create product (seller-only)
- `PUT /products/:id` — Update product (seller/admin)
- `DELETE /products/:id` — Delete product (seller/admin)
- `GET /products/seller/my-products` — Get seller's own products

### Categories
- `GET /categories` — List all categories
- `GET /categories/:id` — Get category details
- `POST /categories` — Create category (admin-only)
- `PUT /categories/:id` — Update category (admin-only)
- `DELETE /categories/:id` — Delete category (admin-only)

### Cart
- `GET /cart` — Get user's cart
- `POST /cart/items` — Add item to cart
- `PUT /cart/items/:itemId` — Update cart item qty
- `DELETE /cart/items/:itemId` — Remove item from cart

### Reviews
- `GET /reviews/product/:productId` — Get product reviews
- `POST /reviews` — Create review (user-only)
- `DELETE /reviews/:id` — Delete review (admin-only)

### Orders
- `POST /orders/checkout` — Place an order
- *(Additional order endpoints can be added for tracking, status updates)*

### Banners & Homepage
- `GET /banners` — List active banners
- `POST /banners` — Create banner (admin-only)
- `PUT /banners/:id` — Update banner (admin-only)
- `DELETE /banners/:id` — Delete banner (admin-only)

### Seller
- `POST /seller/register` — Request seller account
- `GET /seller/me` — Get seller profile (seller-only)

### Admin
- `GET /admin/sellers` — List all sellers (admin-only)
- `POST /admin/sellers/:id/approve` — Approve seller (admin-only)
- `POST /admin/products/:id/approve` — Approve product (admin-only)

### Support
- `POST /support` — Create support ticket
- `GET /support` — List user's tickets
- `POST /support/:id/message` — Post message on ticket

### Payments
- `POST /payments/create` — Create payment intent (stub, integrate Razorpay/Stripe)
- `POST /payments/webhook` — Payment gateway webhook

---

## Testing with Postman

1. Open Postman
2. Import `postman_collection.json`
3. Set up environment variables:
   - `token` — JWT from login response
   - `adminToken` — JWT from admin login
   - `productId` — Product ID from create/list
   - `sellerId` — Seller ID from list
   - `itemId` — Cart item ID
   - `ticketId` — Support ticket ID

4. Run requests in sequence

---

## Project Structure

```
Backend/
├── src/
│   ├── index.js              # Main server entry
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Seller.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Review.js
│   │   ├── Banner.js
│   │   └── SupportTicket.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── reviewController.js
│   │   ├── bannerController.js
│   │   ├── sellerController.js
│   │   ├── adminController.js
│   │   ├── supportController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── cart.js
│   │   ├── reviews.js
│   │   ├── orders.js
│   │   ├── banners.js
│   │   ├── seller.js
│   │   ├── admin.js
│   │   ├── support.js
│   │   └── payments.js
│   └── middleware/
│       └── auth.js           # JWT verification & role-based access
├── package.json
├── .env
├── .gitignore
├── README.md
└── postman_collection.json
```

---

## Key Features

✅ **Multi-user Support** — Customers, Sellers, Admins  
✅ **JWT Authentication** — Secure token-based auth  
✅ **Role-based Access Control** — Middleware for permissions  
✅ **Product Management** — Full CRUD with variants (size, color, material)  
✅ **Cart & Wishlist** — Persistent user carts  
✅ **Reviews & Ratings** — User feedback with admin moderation  
✅ **Order Management** — Checkout with multiple items, status tracking  
✅ **Seller Approval** — Admins approve new sellers  
✅ **Dynamic Banners** — Admin-managed homepage sections  
✅ **Support Tickets** — User-initiated support requests  
✅ **Pagination & Filtering** — Products by category, price, etc.  

---

## Next Steps

1. **Integrate Payment Gateway** — Razorpay / Stripe in `/routes/payments.js`
2. **Add File Uploads** — Multer + Cloudinary for product images
3. **Implement Coupons** — Discount & promo code module
4. **Add Email Notifications** — Nodemailer for order/reset confirmations
5. **Deploy** — Heroku, AWS, or DigitalOcean

---

## Dependencies

- **express** — Web framework
- **mongoose** — MongoDB ODM
- **jsonwebtoken** — JWT auth
- **bcrypt** — Password hashing
- **dotenv** — Environment variables
- **cors** — Cross-origin requests
- **body-parser** — JSON parsing

---

## License

MIT

