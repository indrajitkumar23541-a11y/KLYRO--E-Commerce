const { pool } = require('./backend/config/db');

(async () => {
  try {
    const [result] = await pool.query("UPDATE users SET role = 'admin'");
    console.log(`Updated ${result.affectedRows} users to admin role`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
