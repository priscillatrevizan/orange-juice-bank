const express = require('express');
const router = express.Router();
const AssetsController = require('./assets.controller');

// Endpoint GET /api/v1/assets
// router.get('/', (req, res) => {
//   res.json({ message: 'Assets endpoint funcionando!' });
// });
router.get('/', AssetsController.getAllAssets);

module.exports = router;
