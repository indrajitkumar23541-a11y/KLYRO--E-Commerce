const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const email = 'admin@klyro.com';
    const passwordText = 'admin123';
    
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(passwordText, salt);
    
    // Delete if exists
    await pool.query('DELETE FROM users WHERE email = ?', [email]);
    
    // Insert new admin
    await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Super Admin', email, hashedPassword, 'admin']
    );
    
    console.log("SUCCESS");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
