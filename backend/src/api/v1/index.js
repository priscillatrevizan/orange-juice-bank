const express = require('express');
const router = express.Router();

const userRoutes = require('./users/users.routes');
const assetsRoutes = require('./assets/assets.routes');
const authRoutes = require('./auth/auth.routes');
const transactionsRoutes = require('./transactions/transactions.routes');
const transfersRoutes = require('./transfers/transfers.routes');
const accountsRoutes = require('./accounts/accounts.routes');


router.use('/accounts', accountsRoutes); // POST /accounts/deposit, POST /accounts/withdraw

router.use('/users', userRoutes);     // POST /users, GET /users
router.use('/assets', assetsRoutes);  // GET /assets
router.use('/auth', authRoutes);      // POST /auth/login

router.use('/transactions', transactionsRoutes); // POST /transactions
router.use('/transfers', transfersRoutes); // POST /transfers

module.exports = router;
