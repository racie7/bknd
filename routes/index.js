const express = require('express');
const router = express.Router();

router.use('/nd-mpesa', require('./mpesa'));
router.use('/nd-deposits', require('./deposits'));
router.use('/nd-withdrawals', require('./withdrawals'));
router.use('/nd-rates', require('./rates'));
router.use('/nd-otp', require('./otp'));
router.use('/nd-user', require('./user'));
router.use('/nd-client', require('./client'));

module.exports = router;
