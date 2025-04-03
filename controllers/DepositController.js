const pool = require('../config/db');

module.exports = {
  getDeposits: async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.execute('SELECT * FROM stk_push_results ORDER BY created_at DESC');
      conn.release();

      return res.status(200).json({ deposits: rows });
    } catch (err) {
      console.error('Error fetching deposits:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
