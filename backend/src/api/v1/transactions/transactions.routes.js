const express = require('express');
const router = express.Router();
const { createTransaction, getUserTransactions, getUserExtrato, buyStock, sellStock, sellFixedIncome, buyFixedIncome, buyFund, sellFund } = require('./transactions.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');


// Compra

router.post('/buy', authMiddleware, createTransaction);
router.post('/buy-stock', authMiddleware, buyStock);
router.post('/buy-fixed-income', authMiddleware, buyFixedIncome);
router.post('/buy-fund', authMiddleware, buyFund);

// Venda

router.post('/sell-stock', authMiddleware, sellStock);
router.post('/sell-fixed-income', authMiddleware, sellFixedIncome);
router.post('/sell-fund', authMiddleware, sellFund);

// Consultas
router.get('/statement', authMiddleware, getUserExtrato);
router.get('/', authMiddleware, getUserTransactions);

module.exports = router;
