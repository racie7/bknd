const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');

router.post('/nd-store-client', ClientController.storeClient);
router.get('/nd-user-phone/:CRID', ClientController.getUserPhone);

module.exports = router;
