const express = require('express');
const router = express.Router();
const { createTransaction, getUserTransactions, getUserExtrato } = require('./transactions.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');


router.get('/extrato', authMiddleware, getUserExtrato);
router.post('/buy', authMiddleware, createTransaction);
router.get('/', authMiddleware, getUserTransactions);

module.exports = router;
