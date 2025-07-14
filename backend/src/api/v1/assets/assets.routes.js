const express = require('express');
const router = express.Router();
const AssetsController = require('./assets.controller');

// Endpoint GET /api/v1/assets
// router.get('/', (req, res) => {
//   res.json({ message: 'Assets endpoint funcionando!' });
// });


router.get('/stocks/:id', AssetsController.getStockById);
router.get('/fixed-income/:id', AssetsController.getFixedIncomeById);
router.get('/funds/:id', AssetsController.getFundById);

router.get('/stocks', AssetsController.getAllStocks);
router.get('/fixed-income', AssetsController.getAllFixedIncome);
router.get('/funds', AssetsController.getAllFunds);

router.get('/', AssetsController.getAllAssets);

module.exports = router;
