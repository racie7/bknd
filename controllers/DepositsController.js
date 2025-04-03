const pool = require('../config/db');

module.exports = {
  store: async (req, res) => {
    try {
      const { phone_number, amount, rate, deriv_account_id } = req.body;

      if (!phone_number || !amount || !rate || !deriv_account_id) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const conn = await pool.getConnection();
      await conn.execute(
        'INSERT INTO deposits (phone_number, amount, rate, deriv_account_id) VALUES (?, ?, ?, ?)',
        [phone_number, amount, rate, deriv_account_id]
      );
      conn.release();

      return res.status(201).json({ message: 'Deposit saved successfully' });
    } catch (err) {
      console.error('Store deposit error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  getDeposits: async (req, res) => {
    try {
      const { CRID } = req.params;

      const conn = await pool.getConnection();
      const [rows] = await conn.execute(
        'SELECT * FROM deposits WHERE deriv_account_id = ? ORDER BY created_at DESC',
        [CRID]
      );
      conn.release();

      return res.status(200).json({ deposits: rows });
    } catch (err) {
      console.error('Get deposits error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  getTotalDepositsByUser: async (req, res) => {
    try {
      const { CRID } = req.params;

      const conn = await pool.getConnection();
      const [rows] = await conn.execute(
        'SELECT SUM(amount) as total FROM deposits WHERE deriv_account_id = ?',
        [CRID]
      );
      conn.release();

      const total = rows[0].total || 0;
      return res.status(200).json({ total });
    } catch (err) {
      console.error('Get total deposits error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
