const pool = require('../config/db');

module.exports = {
  handleTimeout: async (req, res) => {
    try {
      const result = req.body?.Result;

      if (!result) {
        return res.status(400).json({ message: 'Invalid timeout data' });
      }

      const { OriginatorConversationID, ConversationID, ResultDesc } = result;

      const sql = `
        INSERT INTO b2c_timeouts (OriginatorConversationID, ConversationID, ResultDesc, timeout_data)
        VALUES (?, ?, ?, ?)
      `;

      const conn = await pool.getConnection();
      await conn.execute(sql, [
        OriginatorConversationID,
        ConversationID,
        ResultDesc,
        JSON.stringify(result)
      ]);
      conn.release();

      return res.status(200).json({ message: 'B2C timeout processed' });
    } catch (error) {
      console.error('B2C timeout callback error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
