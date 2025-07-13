const express = require('express');
const router = express.Router();
const { depositarConta, sacarConta, getContasByUser } = require('./accounts.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');

router.post('/deposit', authMiddleware, depositarConta);
router.post('/withdraw', authMiddleware, sacarConta);

// Buscar todas as contas de um usuário
router.get('/user/:userId', getContasByUser);

module.exports = router;
