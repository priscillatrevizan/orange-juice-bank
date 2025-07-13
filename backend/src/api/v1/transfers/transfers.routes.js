const express = require('express');
const router = express.Router();
const { transferirInterna, transferirExterna } = require('./transfers.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');
const { buyStock } = require('../transactions/transactions.controller');
const { sellStock } = require('../transactions/transactions.controller');

router.post('/sell-stock', authMiddleware, sellStock);

router.post('/buy-stock', authMiddleware, buyStock);

router.post('/internal', authMiddleware, transferirInterna);
router.post('/external', authMiddleware, transferirExterna);

module.exports = router;
