const express = require('express');
const router = express.Router();

const userRoutes = require('./users/users.routes');
router.use('/users', userRoutes); // GET /api/v1/users

const assetsRoutes = require('./assets/assets.routes');
router.use('/assets', assetsRoutes); // GET /api/v1/assets

module.exports = router;
