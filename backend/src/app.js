const express = require('express');
const app = express();
const cors = require('cors');

const v1Routes = require('./api/v1');

app.use(cors());
app.use(express.json());

app.use('/api/v1', v1Routes); // <- aqui define o prefixo para todas as rotas da versão

module.exports = app;
