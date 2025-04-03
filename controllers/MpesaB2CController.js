const axios = require('axios');

module.exports = {
  b2cRequest: async (req, res) => {
    try {
      const { phone, amount, remarks } = req.body;

      if (!phone || !amount) {
        return res.status(400).json({ message: 'Phone and amount are required' });
      }

      const b2cRequest = {
        InitiatorName: process.env.B2C_INITIATOR_NAME,
        SecurityCredential: 'EncryptedSecurityCredentialHere',
        CommandID: 'BusinessPayment',
        Amount: amount,
        PartyA: process.env.B2C_SHORTCODE,
        PartyB: phone,
        Remarks: remarks || 'Withdrawal',
        QueueTimeOutURL: process.env.B2C_QUEUE_TIMEOUT_URL,
        ResultURL: process.env.B2C_RESULT_URL,
        Occasion: 'Payment'
      };

      const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest', b2cRequest, {
        headers: {
          Authorization: `Bearer ${process.env.MPESA_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      return res.status(200).json({ message: 'B2C request sent', data: response.data });
    } catch (error) {
      console.error('B2C request error:', error.response?.data || error.message);
      return res.status(500).json({ message: 'B2C request failed' });
    }
  }
};
