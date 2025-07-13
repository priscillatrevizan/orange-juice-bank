const express = require('express');
const router = express.Router();
const { createTransaction, getUserTransactions, getUserExtrato, buyStock, sellStock, sellFixedIncome, buyFixedIncome } = require('./transactions.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');


// Compra
router.post('/buy', authMiddleware, createTransaction);
router.post('/buy-stock', authMiddleware, buyStock);
router.post('/buy-fixed-income', authMiddleware, buyFixedIncome);

// Venda
router.post('/sell-stock', authMiddleware, sellStock);
router.post('/sell-fixed-income', authMiddleware, sellFixedIncome);

// Consultas
router.get('/statement', authMiddleware, getUserExtrato);
router.get('/', authMiddleware, getUserTransactions);

module.exports = router;
