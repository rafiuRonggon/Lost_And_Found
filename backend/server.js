const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const pool = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check Route ───────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// ─── Database Test Route ───────────────────────────────────────────────────────
app.get('/api/db-test', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 as test');
    connection.release();
    res.json({ status: 'Database connection successful', data: rows });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', message: error.message });
  }
});

// ─── Get All Users (Example endpoint) ───────────────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT id, name, email, join_date, is_admin FROM users');
    connection.release();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

// ─── Get All Items (Example endpoint) ───────────────────────────────────────
app.get('/api/items', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [items] = await connection.query(`
      SELECT i.*, u.name as posted_by_name 
      FROM items i 
      LEFT JOIN users u ON i.posted_by = u.id 
      ORDER BY i.date_posted DESC
    `);
    connection.release();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items', message: error.message });
  }
});

// ─── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// ─── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Lost & Found Backend Server`);
  console.log(`📍 Running on http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /api/health      - Server health check`);
  console.log(`  GET  /api/db-test     - Database connection test`);
  console.log(`  GET  /api/users       - Get all users`);
  console.log(`  GET  /api/items       - Get all items`);
  console.log(`\n`);
});

module.exports = app;
