const express = require('express');
const router = express.Router();
const DepositsController = require('../controllers/DepositsController');

router.post('/nd', DepositsController.store);
router.get('/nd/:CRID', DepositsController.getDeposits);
router.get('/nd-total/:CRID', DepositsController.getTotalDepositsByUser);

module.exports = router;
