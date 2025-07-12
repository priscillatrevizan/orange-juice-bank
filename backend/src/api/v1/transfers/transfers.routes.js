const express = require('express');
const router = express.Router();
const { transferir } = require('./transfers.controller');
const authMiddleware = require('../../../middlewares/authMiddleware');

router.post('/', authMiddleware, transferir);

module.exports = router;
