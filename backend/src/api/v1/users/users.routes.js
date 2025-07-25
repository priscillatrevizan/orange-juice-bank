const express = require('express');
const router = express.Router();

const userController = require('./users.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');


// Liberar o cadastro sem autenticação
router.post('/', userController.createUser);

// Middleware global para rotas protegidas
router.use(authMiddleware);


// Rota protegida para listar usuários
router.get('/', userController.getAllUsers);

// Rota protegida para obter o usuário autenticado
router.get('/me', userController.getMe);

module.exports = router;
