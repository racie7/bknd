const express = require('express');
const router = express.Router();
const DepositController = require('../controllers/DepositController');

router.get('/nd', DepositController.getDeposits);

module.exports = router;
