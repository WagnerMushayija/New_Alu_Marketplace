// routes/productCategories.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Since we don't have the actual controller yet, we'll create a placeholder
const categoryController = {
  getAllCategories: (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: [
        { id: 1, name: 'Electronics', description: 'Electronic devices and accessories' },
        { id: 2, name: 'Clothing', description: 'Apparel and fashion items' },
        { id: 3, name: 'Books', description: 'Books and publications' }
      ]
    });
  },
  getCategoryById: (req, res) => {
    const id = parseInt(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: { id, name: 'Sample Category', description: 'This is a sample category' }
    });
  },
  createCategory: (req, res) => {
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { id: 4, ...req.body }
    });
  },
  updateCategory: (req, res) => {
    const id = parseInt(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { id, ...req.body }
    });
  },
  deleteCategory: (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  }
};

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected routes (admin only)
router.post('/', auth.verifyToken, auth.isAdmin, categoryController.createCategory);
router.put('/:id', auth.verifyToken, auth.isAdmin, categoryController.updateCategory);
router.delete('/:id', auth.verifyToken, auth.isAdmin, categoryController.deleteCategory);

module.exports = router;
