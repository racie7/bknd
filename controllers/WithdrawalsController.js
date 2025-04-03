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
        'INSERT INTO withdrawals (phone_number, amount, rate, deriv_account_id, status) VALUES (?, ?, ?, ?, ?)',
        [phone_number, amount, rate, deriv_account_id, 'pending']
      );
      conn.release();

      return res.status(201).json({ message: 'Withdrawal request saved successfully' });
    } catch (err) {
      console.error('Store withdrawal error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  getWithdrawals: async (req, res) => {
    try {
      const { phoneNumber } = req.params;

      const conn = await pool.getConnection();
      const [rows] = await conn.execute(
        'SELECT * FROM withdrawals WHERE phone_number = ? ORDER BY created_at DESC',
        [phoneNumber]
      );
      conn.release();

      return res.status(200).json({ withdrawals: rows });
    } catch (err) {
      console.error('Get withdrawals error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  getTotalWithdrawalsByUser: async (req, res) => {
    try {
      const { phoneNumber } = req.params;

      const conn = await pool.getConnection();
      const [rows] = await conn.execute(
        'SELECT SUM(amount) as total FROM withdrawals WHERE phone_number = ?',
        [phoneNumber]
      );
      conn.release();

      const total = rows[0].total || 0;
      return res.status(200).json({ total });
    } catch (err) {
      console.error('Get total withdrawals error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
