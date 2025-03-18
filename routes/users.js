const express = require('express');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();

// Get all users
router.get('/', verifyToken, async (req, res) => {
  try {
    const [users] = await db.pool.query('SELECT id, username, email FROM users');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get a single user
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await db.pool.query('SELECT id, username, email FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const [users] = await db.pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updatedUser = {
      username: username || users[0].username,
      email: email || users[0].email,
      password: password ? await bcrypt.hash(password, 10) : users[0].password
    };

    await db.pool.query(
      'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
      [updatedUser.username, updatedUser.email, updatedUser.password, id]
    );

    res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete user
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
