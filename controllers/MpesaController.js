const pool = require('../config/db');

module.exports = {
  stkPushCallback: async (req, res) => {
    try {
      console.log('📥 STK Push Callback Received');

      const callbackData = req.body?.Body?.stkCallback;
      if (!callbackData) {
        return res.status(400).json({ message: 'Invalid callback data' });
      }

      const {
        MerchantRequestID,
        CheckoutRequestID,
        ResultCode,
        ResultDesc
      } = callbackData;

      if (!MerchantRequestID || !CheckoutRequestID || typeof ResultCode === 'undefined' || !ResultDesc) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const sql = `
        INSERT INTO stk_push_results 
        (MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, callback_data)
        VALUES (?, ?, ?, ?, ?)
      `;

      const conn = await pool.getConnection();
      try {
        await conn.execute(sql, [
          MerchantRequestID,
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          JSON.stringify(callbackData)
        ]);
      } finally {
        conn.release();
      }

      return res.status(200).json({ message: 'Callback processed' });
    } catch (error) {
      console.error('Error handling STK Push Callback:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
