const pool = require('./db/connection');

async function addMissingColumns() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    console.log('🔧 Checking and adding missing columns...');
    
    // Check if category column exists, if not add it
    try {
      await connection.query('ALTER TABLE items ADD COLUMN category VARCHAR(50) DEFAULT "other"');
      console.log('✅ Added category column to items table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  category column already exists');
      } else {
        throw err;
      }
    }
    
    // Check if image_emoji column exists, if not add it
    try {
      await connection.query('ALTER TABLE items ADD COLUMN image_emoji VARCHAR(10) DEFAULT "📦"');
      console.log('✅ Added image_emoji column to items table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  image_emoji column already exists');
      } else {
        throw err;
      }
    }
    
    // Check if tags column exists, if not add it
    try {
      await connection.query('ALTER TABLE items ADD COLUMN tags JSON DEFAULT NULL');
      console.log('✅ Added tags column to items table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  tags column already exists');
      } else {
        throw err;
      }
    }
    
    // Add index on category column if not exists
    try {
      await connection.query('ALTER TABLE items ADD INDEX idx_category (category)');
      console.log('✅ Added category index');
    } catch (err) {
      if (err.code === 'ER_DUP_KEY_NAME') {
        console.log('ℹ️  category index already exists');
      } else {
        console.log('ℹ️  Could not add index:', err.message);
      }
    }
    
    console.log('✅ Database schema migration complete!');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (connection) connection.release();
    process.exit(1);
  }
}

addMissingColumns();
