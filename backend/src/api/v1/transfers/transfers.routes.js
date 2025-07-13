const express = require('express');
const router = express.Router();
const { transferir } = require('./transfers.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');
const { buyStock } = require('../transactions/transactions.controller');
const { sellStock } = require('../transactions/transactions.controller');

router.post('/sell-stock', authMiddleware, sellStock);

router.post('/buy-stock', authMiddleware, buyStock);

router.post('/', authMiddleware, transferir);

module.exports = router;
