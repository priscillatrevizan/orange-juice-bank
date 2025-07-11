const express = require('express');
const app = express();
const apiV1Routes = require('./api/v1');

app.use(express.json()); // necessário para `req.body`
app.use('/api/v1', apiV1Routes);

module.exports = app;

