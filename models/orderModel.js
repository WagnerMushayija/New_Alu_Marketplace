const pool = require('../config/db'); // Import database connection

const OrderModel = {
  async getAllOrders() {
    const [orders] = await pool.query(`
      SELECT * FROM order_details
    `);
    return orders;
  },

  async getOrderById(orderId) {
    const [order] = await pool.query(
      `SELECT * FROM order_details WHERE id = ?`,
      [orderId]
    );

    if (order.length === 0) return null;

    const [items] = await pool.query(
      `SELECT oi.*, p.name AS product_name
      FROM order_items oi
      JOIN product p ON oi.product_id = p.id
      WHERE oi.order_id = ?`,
      [orderId]
    );

    return { ...order[0], items };
  },

  async createOrder(userId, total, items, paymentId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Insert order into order_details
      const [orderResult] = await connection.query(
        `INSERT INTO order_details (user_id, total, payment_id, status) 
         VALUES (?, ?, ?, 'pending')`,
        [userId, total, paymentId]
      );

      const orderId = orderResult.insertId;

      // Insert items into order_items
      for (let item of items) {
        await connection.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price) 
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price]
        );
      }

      await connection.commit();
      return { orderId, status: 'pending', total, items };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = OrderModel;
