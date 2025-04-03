const pool = require('../config/db');

module.exports = {
  getRates: async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const [rows] = await conn.execute('SELECT * FROM rates LIMIT 1');
      conn.release();

      if (rows.length > 0) {
        return res.status(200).json({ rates: rows[0] });
      } else {
        return res.status(404).json({ message: 'Rates not found' });
      }
    } catch (err) {
      console.error('Get rates error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateRates: async (req, res) => {
    try {
      const { deposit_rate, withdrawal_rate } = req.body;

      if (!deposit_rate || !withdrawal_rate) {
        return res.status(400).json({ message: 'Both rates are required' });
      }

      const conn = await pool.getConnection();
      await conn.execute(
        'UPDATE rates SET deposit_rate = ?, withdrawal_rate = ?',
        [deposit_rate, withdrawal_rate]
      );
      conn.release();

      return res.status(200).json({ message: 'Rates updated successfully' });
    } catch (err) {
      console.error('Update rates error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
