const express = require('express');
const router = express.Router();
const WithdrawalsController = require('../controllers/WithdrawalsController');

router.post('/nd', WithdrawalsController.store);
router.get('/nd:phoneNumber', WithdrawalsController.getWithdrawals);
router.get('/nd-total/:phoneNumber', WithdrawalsController.getTotalWithdrawalsByUser);

module.exports = router;
