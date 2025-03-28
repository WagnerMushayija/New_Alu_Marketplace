// const app = require('./app');
// const { pool } = require('./config/db');

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
// });

// // Test database connection
// const testDbConnection = async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log('Database connected successfully');
//     connection.release();
//   } catch (error) {
//     console.error('Database connection error:', error);
//   }
// };

// testDbConnection();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.status(200).send('<h1>hello<h1>')
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});