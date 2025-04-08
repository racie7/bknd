const pool = require('../config/db');

module.exports = {
  storeClient: async (req, res) => {
    try {
      const { CRID, phone_number } = req.body;

      if (!CRID || !phone_number) {
        return res.status(400).json({ message: 'Account ID and phone are required' });
      }

      const conn = await pool.getConnection();
      await conn.execute(
        'INSERT INTO clients (CRID, phone_number) VALUES (?, ?) ON DUPLICATE KEY UPDATE phone_number = ?',
        [CRID, phone_number, phone_number]
      );
      conn.release();

      return res.status(201).json({ message: 'Client stored successfully' });
    } catch (err) {
      console.error('Store client error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  getUserPhone: async (req, res) => {
    console.log('🔔 Hit getUserPhone route');

    try {
      const { CRID } = req.params;

      const conn = await pool.getConnection();
      const [rows] = await conn.execute('SELECT phone_number FROM clients WHERE CRID = ?', [CRID]);
      conn.release();

      console.log('CRID requested:', CRID);
      console.log('DB rows returned:', rows);

      if (rows.length > 0) {
        return res.status(200).json({ phone_number: rows[0].phone_number });
      } else {
        return res.status(404).json({ message: 'Client not found' });
      }
    } catch (err) {
      console.error('🔥 Caught error in getUserPhone:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

};
