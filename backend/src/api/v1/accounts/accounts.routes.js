const express = require('express');
const router = express.Router();
const { depositarConta, sacarConta } = require('./accounts.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');

router.post('/deposit', authMiddleware, depositarConta);
router.post('/withdraw', authMiddleware, sacarConta);

module.exports = router;
