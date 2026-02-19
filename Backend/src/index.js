require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const passport = require('passport');
// Configure passport strategies
require('./config/passport')(passport);

const app = express();
// Configure CORS so the frontend can send credentials (cookies, auth)
const corsOptions = {
	origin: process.env.CLIENT_URL,
	credentials: true,
};
app.use(cors(corsOptions));
// Keep raw request body available on req.rawBody (needed for webhook signature verification)
app.use(bodyParser.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

// Middleware
app.use(logger);
app.use(passport.initialize());

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI ;

connectDB(MONGO_URI);

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/new-arrivals', require('./routes/newArrivals'));
app.use('/orders', require('./routes/orders'));
app.use('/categories', require('./routes/categories'));
app.use('/navigations', require('./routes/navigations'));
app.use('/reviews', require('./routes/reviews'));
app.use('/cart', require('./routes/cart'));
app.use('/wishlist', require('./routes/wishlist'));
app.use('/banners', require('./routes/banners'));
app.use('/category-display', require('./routes/categoryDisplay'));
app.use('/seller', require('./routes/seller'));
app.use('/admin', require('./routes/admin'));
app.use('/support', require('./routes/support'));
app.use('/payments', require('./routes/payments'));

app.get('/', (req, res) => res.json({ message: 'Clothing backend running' }));

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
