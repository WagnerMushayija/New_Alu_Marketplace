const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const errorHandler = require('./middleware/error');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const productCategoryRoutes = require('./routes/productCategories'); // Changed from categories
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files directory for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/product-categories', productCategoryRoutes); // Changed from categories
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// API documentation route
if (process.env.NODE_ENV !== 'production') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('./docs/swagger.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ALU Marketplace API' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
