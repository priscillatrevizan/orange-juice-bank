const express = require('express');
const router = express.Router();
const { depositarConta, sacarConta, getContasByUser } = require('./accounts.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');

router.post('/deposit', authMiddleware, depositarConta);
router.post('/withdraw', authMiddleware, sacarConta);

// Buscar todas as contas de um usuário

// Nova rota: retorna contas do usuário autenticado (usada nos testes de fundos)

// GET /api/v1/accounts exige autenticação e só retorna contas do usuário autenticado
router.get('/', authMiddleware, getContasByUser);

router.get('/user/:userId', getContasByUser);

module.exports = router;
