const { pool } = require('../config/db');
const { validateOrder } = require('../middleware/validation');
const paymentService = require('../services/paymentService');

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || null;
    
    let query = `
      SELECT o.*, u.username, u.first_name, u.last_name,
              p.provider as payment_provider, p.status as payment_status
      FROM order_details o
      JOIN users u ON o.user_id = u.id
      JOIN payment_details p ON o.payment_id = p.id
    `;
    
    let countQuery = 'SELECT COUNT(*) as total FROM order_details o';
    let queryParams = [];
    
    if (status) {
      query += ' WHERE p.status = ?';
      countQuery += ' JOIN payment_details p ON o.payment_id = p.id WHERE p.status = ?';
      queryParams.push(status);
    }
    
    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
    
    const [orders] = await pool.query(query, queryParams);
    
    // Get order items for each order
    for (let order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, p.name, p.price, p.image_url 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }
    
    // Get total count for pagination
    const [countResult] = await pool.query(countQuery, status ? [status] : []);
    const totalOrders = countResult[0].total;
    
    return res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          total: totalOrders,
          page,
          limit,
          pages: Math.ceil(totalOrders / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message
    });
  }
};
