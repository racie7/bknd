const express = require('express');
const router = express.Router();
const OtpController = require('../controllers/OtpController');

router.post('/nd-send-otp', OtpController.sendOtp);
router.post('/nd-verify-otp', OtpController.verifyOtp);

module.exports = router;
