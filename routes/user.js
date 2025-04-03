const express = require('express');
const router = express.Router();

// Placeholder for user authentication/authorization if needed
router.get('/nd', (req, res) => {
  res.status(200).json({ message: 'User route active' });
});

module.exports = router;
