const express = require('express');
const router = express.Router();

// Placeholder controller
const authController = {
  register: (req, res) => {
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: 1, username: req.body.username, email: req.body.email }
    });
  },
  login: (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: 'sample_jwt_token',
      user: { id: 1, username: req.body.username, email: req.body.email }
    });
  },
  logout: (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  }
};

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
