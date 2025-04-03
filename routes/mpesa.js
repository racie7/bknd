const express = require('express');
const router = express.Router();
const MpesaController = require('../controllers/MpesaController');
const MpesaInitiateController = require('../controllers/MpesaInitiateController');
const MpesaB2CController = require('../controllers/MpesaB2CController');
const MpesaResultController = require('../controllers/MpesaResultController');
const MpesaTimeoutController = require('../controllers/MpesaTimeoutController');

// STK Push
router.post('/nd-stk-push', MpesaInitiateController.initiateStkPush);
router.post('/nd-stk-push/callback', MpesaController.stkPushCallback);

// B2C
router.post('/nd-payment', MpesaB2CController.b2cRequest);
router.post('/nd-b2c/result', MpesaResultController.handleResult);
router.post('/nd-b2c/queue', MpesaTimeoutController.handleTimeout);

module.exports = router;
