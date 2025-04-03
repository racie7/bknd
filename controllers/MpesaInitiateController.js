const axios = require('axios');
const pool = require('../config/db');

const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
};

module.exports = {
  initiateStkPush: async (req, res) => {
    try {
      const { amount, phone, account_reference, transaction_desc } = req.body;

      if (!amount || !phone || !account_reference || !transaction_desc) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const timestamp = getTimestamp();
      const shortCode = process.env.MPESA_SHORTCODE;
      const passkey = process.env.MPESA_PASSKEY;
      const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');

      const stkRequest = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: account_reference,
        TransactionDesc: transaction_desc,
      };

      const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', stkRequest, {
        headers: {
          Authorization: `Bearer ${process.env.MPESA_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      return res.status(200).json({ message: 'STK Push initiated', data: response.data });
    } catch (error) {
      console.error('Error initiating STK Push:', error.response?.data || error.message);
      return res.status(500).json({ message: 'STK Push initiation failed' });
    }
  }
};
