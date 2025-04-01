const db = require('../config/db'); // Database connection

// Controller function to create an order
exports.createOrder = async (req, res, next) => {
  const { user_id, product_id, quantity, total_price, status } = req.body;

  console.log('New Order Request:', { user_id, product_id, quantity, total_price, status });

  if (!user_id || !product_id || !quantity || !total_price || !status) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }

  try {
    const [result] = await db.pool.promise().query(
      'INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)', 
      [user_id, product_id, quantity, total_price, status]
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: { 
        id: result.insertId, 
        user_id, 
        product_id, 
        quantity, 
        total_price, 
        status 
      }
    });
  } catch (error) {
    console.error('Order Creation Error:', error);
    next(error);
  }
};

// Controller function to get orders
exports.getOrders = async (req, res, next) => {
  try {
    const [orders] = await db.pool.promise().query('SELECT * FROM orders');
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found'
      });
    }

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    next(error);
  }
};
