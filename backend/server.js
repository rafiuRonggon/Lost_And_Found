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

// ─── Get Items by Category ────────────────────────────────────────────────────
app.get('/api/items/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const connection = await pool.getConnection();
    const [items] = await connection.query(`
      SELECT i.*, u.name as posted_by_name 
      FROM items i 
      LEFT JOIN users u ON i.posted_by = u.id 
      WHERE i.category = ?
      ORDER BY i.date_posted DESC
    `, [category]);
    connection.release();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items by category', message: error.message });
  }
});

// ─── Search Items by Tags ────────────────────────────────────────────────────
app.get('/api/items/search/tags/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const connection = await pool.getConnection();
    const [items] = await connection.query(`
      SELECT i.*, u.name as posted_by_name 
      FROM items i 
      LEFT JOIN users u ON i.posted_by = u.id 
      WHERE JSON_CONTAINS(i.tags, JSON_QUOTE(?))
      ORDER BY i.date_posted DESC
    `, [tag]);
    connection.release();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search items by tag', message: error.message });
  }
});

// ─── Comments Endpoints ────────────────────────────────────────────────────────

// Get comments for a specific item
app.get('/api/comments/:item_id', async (req, res) => {
  try {
    const { item_id } = req.params;
    const connection = await pool.getConnection();
    const [comments] = await connection.query(`
      SELECT c.id, c.comment_text, c.created_at, u.name as user_name, u.id as user_id
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.item_id = ?
      ORDER BY c.created_at ASC
    `, [item_id]);
    connection.release();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments', message: error.message });
  }
});

// Post a new comment
app.post('/api/comments', async (req, res) => {
  try {
    const { item_id, user_id, comment_text } = req.body;
    
    if (!item_id || !user_id || !comment_text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO comments (item_id, user_id, comment_text) VALUES (?, ?, ?)',
      [item_id, user_id, comment_text]
    );
    connection.release();
    
    res.status(201).json({ 
      id: result.insertId, 
      item_id, 
      user_id, 
      comment_text, 
      created_at: new Date() 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to post comment', message: error.message });
  }
});

// Delete a comment
app.delete('/api/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM comments WHERE id = ?', [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment', message: error.message });
  }
});

// ─── Messaging Endpoints ────────────────────────────────────────────────────────

// Get all conversations for a user
app.get('/api/conversations/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const connection = await pool.getConnection();
    
    // Get unique conversations (sender or receiver)
    const [conversations] = await connection.query(`
      SELECT 
        CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as other_user_id,
        MAX(created_at) as last_message_at,
        SUM(CASE WHEN is_read = FALSE AND receiver_id = ? THEN 1 ELSE 0 END) as unread_count
      FROM messages
      WHERE sender_id = ? OR receiver_id = ?
      GROUP BY CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
      ORDER BY last_message_at DESC
    `, [user_id, user_id, user_id, user_id, user_id]);
    
    // Get user details for each conversation
    const result = await Promise.all(conversations.map(async (conv) => {
      const [user] = await connection.query('SELECT id, name FROM users WHERE id = ?', [conv.other_user_id]);
      return { ...conv, other_user: user[0] };
    }));
    
    connection.release();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations', message: error.message });
  }
});

// Get messages between two users
app.get('/api/messages/:user_id/:other_user_id', async (req, res) => {
  try {
    const { user_id, other_user_id } = req.params;
    const connection = await pool.getConnection();
    
    const [messages] = await connection.query(`
      SELECT m.*, u.name as sender_name, i.title as item_title
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      LEFT JOIN items i ON m.item_id = i.id
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `, [user_id, other_user_id, other_user_id, user_id]);
    
    connection.release();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages', message: error.message });
  }
});

// Send a new message
app.post('/api/messages', async (req, res) => {
  try {
    const { sender_id, receiver_id, message_text, item_id } = req.body;
    
    if (!sender_id || !receiver_id || !message_text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO messages (sender_id, receiver_id, message_text, item_id) VALUES (?, ?, ?, ?)',
      [sender_id, receiver_id, message_text, item_id || null]
    );
    connection.release();
    
    res.status(201).json({ 
      id: result.insertId, 
      sender_id, 
      receiver_id, 
      message_text, 
      item_id: item_id || null,
      created_at: new Date() 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message', message: error.message });
  }
});

// Mark message as read
app.put('/api/messages/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE messages SET is_read = TRUE WHERE id = ?',
      [id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark message as read', message: error.message });
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
  console.log(`  GET  /api/items/category/:category - Get items by category`);
  console.log(`  GET  /api/items/search/tags/:tag - Search items by tag`);
  console.log(`  GET  /api/comments/:item_id  - Get comments for an item`);
  console.log(`  POST /api/comments    - Post a new comment`);
  console.log(`  DELETE /api/comments/:id - Delete a comment`);
  console.log(`  GET  /api/conversations/:user_id - Get conversations for user`);
  console.log(`  GET  /api/messages/:user_id/:other_user_id - Get messages between users`);
  console.log(`  POST /api/messages    - Send a new message`);
  console.log(`  PUT  /api/messages/:id/read - Mark message as read`);
  console.log(`\n`);
});

module.exports = app;
