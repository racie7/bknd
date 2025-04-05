const pool = require('../config/db');
const crypto = require('crypto');

module.exports = {
  sendOtp: async (req, res) => {
    try {
      const { phone } = req.body;

      if (!phone) return res.status(400).json({ message: 'Phone is required' });

      const otp = Math.floor(100000 + Math.random() * 900000);
      const expires_at = new Date(Date.now() + 3 * 60 * 1000); // 3 mins

      const conn = await pool.getConnection();
      await conn.execute(
          'INSERT INTO otps (phone_number, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?',
          [phone, otp, expires_at, otp, expires_at]
      );
      conn.release();

      // ✉️ Send SMS
      const smsApiUrl = "https://api.africastalking.com/version1/messaging";
      const apiKey = process.env.AT_API_KEY;
      const username = process.env.AT_USERNAME;
      const senderId = "FREVIALTD";

      const payload = new URLSearchParams({
        username,
        to: phone,
        message: `Your Fast Pesa OTP to change phone number is ${otp}. Thank you for choosing us.`,
        from: senderId,
      });

      const smsResponse = await axios.post(smsApiUrl, payload, {
        headers: {
          apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });

      console.log("✅ SMS sent:", smsResponse.data);

      return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
      console.error('❌ Send OTP error:', err.response?.data || err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      let { phone, otp } = req.body;

      if (!phone || !otp) {
        return res.status(400).json({ message: 'Phone and OTP are required' });
      }

      // Normalize phone: remove "+" if present
      phone = phone.startsWith('+') ? phone.slice(1) : phone;

      const conn = await pool.getConnection();
      const [rows] = await conn.execute(
          `SELECT * FROM otps 
       WHERE (phone_number = ? OR phone_number = ?) 
       AND otp = ? 
       AND expires_at > NOW()`,
          [phone, `+${phone}`, otp]
      );
      conn.release();

      if (rows.length > 0) {
        return res.status(200).json({ message: 'OTP verified successfully' });
      } else {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

};
