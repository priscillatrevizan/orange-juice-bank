const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const validateUserPayload = require('../../../middlewares/validateUserPayload');

router.post('/', validateUserPayload, usersController.createUser);

module.exports = router;

