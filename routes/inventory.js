const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all inventory items
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        inventory.id,
        inventory.product_id,
        products.name AS product_name,
        inventory.quantity,
        inventory.status,
        inventory.last_updated
      FROM inventory
      JOIN products ON inventory.product_id = products.id
      ORDER BY products.name ASC
    `);
    
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    next(error);
  }
});

// Get inventory by product ID
router.get('/product/:productId', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM inventory WHERE product_id = ?`,
      [req.params.productId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No inventory found for this product'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching product inventory:', error);
    next(error);
  }
});

// Get a single inventory item
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM inventory WHERE id = ?`,
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    next(error);
  }
});

// Add new inventory (admin only)
router.post('/', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const { product_id, quantity, status } = req.body;
    
    // Validate required fields
    if (!product_id || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product_id and quantity'
      });
    }
    
    // Check if the product exists
    const [productRows] = await pool.query(
      'SELECT id FROM products WHERE id = ?',
      [product_id]
    );
    
    if (productRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if inventory already exists for this product
    const [inventoryRows] = await pool.query(
      'SELECT id FROM inventory WHERE product_id = ?',
      [product_id]
    );
    
    if (inventoryRows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Inventory already exists for this product. Use PUT to update.'
      });
    }
    
    // Insert new inventory
    const [result] = await pool.query(
      `INSERT INTO inventory (product_id, quantity, status, last_updated) 
       VALUES (?, ?, ?, NOW())`,
      [product_id, quantity, status || 'in_stock']
    );
    
    const [newItem] = await pool.query(
      'SELECT * FROM inventory WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      data: newItem[0]
    });
  } catch (error) {
    console.error('Error adding inventory:', error);
    next(error);
  }
});

// Update inventory (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const { quantity, status } = req.body;
    
    // Validate the inventory ID exists
    const [inventoryRows] = await pool.query(
      'SELECT id FROM inventory WHERE id = ?',
      [req.params.id]
    );
    
    if (inventoryRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }
    
    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    
    if (quantity !== undefined) {
      updates.push('quantity = ?');
      values.push(quantity);
    }
    
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    
    updates.push('last_updated = NOW()');
    
    // Add the id at the end for the WHERE clause
    values.push(req.params.id);
    
    const [result] = await pool.query(
      `UPDATE inventory SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory update failed'
      });
    }
    
    const [updatedItem] = await pool.query(
      'SELECT * FROM inventory WHERE id = ?',
      [req.params.id]
    );
    
    res.json({
      success: true,
      data: updatedItem[0]
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    next(error);
  }
});

// Update inventory by product ID (admin only)
router.put('/product/:productId', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const { quantity, status } = req.body;
    
    // Validate the inventory exists for this product
    const [inventoryRows] = await pool.query(
      'SELECT id FROM inventory WHERE product_id = ?',
      [req.params.productId]
    );
    
    if (inventoryRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No inventory found for this product'
      });
    }
    
    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    
    if (quantity !== undefined) {
      updates.push('quantity = ?');
      values.push(quantity);
    }
    
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    
    updates.push('last_updated = NOW()');
    
    // Add the product_id at the end for the WHERE clause
    values.push(req.params.productId);
    
    const [result] = await pool.query(
      `UPDATE inventory SET ${updates.join(', ')} WHERE product_id = ?`,
      values
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory update failed'
      });
    }
    
    const [updatedItem] = await pool.query(
      'SELECT * FROM inventory WHERE product_id = ?',
      [req.params.productId]
    );
    
    res.json({
      success: true,
      data: updatedItem[0]
    });
  } catch (error) {
    console.error('Error updating inventory by product ID:', error);
    next(error);
  }
});

// Delete inventory (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM inventory WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    next(error);
  }
});

module.exports = router;