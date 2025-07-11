const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas base de teste
app.get('/', (req, res) => {
  res.send('OrangeJuiceBank API rodando!');
});

module.exports = app;
