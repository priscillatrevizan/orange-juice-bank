const express = require('express');
const router = express.Router();
const userController = require('./users.controller');

router.post('/register', userController.registerUser);
router.get('/', (req, res) => {
  res.send('Rota de usuários está funcionando!');
});

module.exports = router;
