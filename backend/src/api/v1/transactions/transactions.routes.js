const express = require('express');
const router = express.Router();
const { createTransaction, getUserTransactions, getUserExtrato, buyStock, sellStock } = require('./transactions.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');



router.get('/extrato', authMiddleware, getUserExtrato);
router.post('/buy', authMiddleware, createTransaction);
router.post('/buy-stock', authMiddleware, buyStock);
router.post('/sell-stock', authMiddleware, sellStock);
router.get('/', authMiddleware, getUserTransactions);

module.exports = router;
