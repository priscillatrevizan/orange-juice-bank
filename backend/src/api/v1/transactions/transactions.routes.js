const express = require('express');
const router = express.Router();
const { createTransaction } = require('./transactions.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');

router.post('/buy', authMiddleware, createTransaction);

module.exports = router;
