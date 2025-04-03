const pool = require('../config/db');

module.exports = {
  handleResult: async (req, res) => {
    try {
      const result = req.body?.Result;
      if (!result || !result.ResultType) {
        return res.status(400).json({ message: 'Invalid result callback' });
      }

      const { ResultCode, ResultDesc, OriginatorConversationID, ConversationID, TransactionID } = result;

      const sql = `
        INSERT INTO b2c_results (ResultCode, ResultDesc, OriginatorConversationID, ConversationID, TransactionID, result_data)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const conn = await pool.getConnection();
      await conn.execute(sql, [
        ResultCode,
        ResultDesc,
        OriginatorConversationID,
        ConversationID,
        TransactionID,
        JSON.stringify(result)
      ]);
      conn.release();

      return res.status(200).json({ message: 'B2C result processed' });
    } catch (error) {
      console.error('B2C result callback error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
