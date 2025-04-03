const express = require('express');
const router = express.Router();
const RateController = require('../controllers/RateController');

router.get('/nd', RateController.getRates);
router.post('/nd', RateController.updateRates);

module.exports = router;
