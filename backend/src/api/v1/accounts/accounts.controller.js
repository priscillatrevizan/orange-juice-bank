const { depositar, sacar } = require('./accounts.service');

async function depositarConta(req, res) {
  try {
    const userId = req.user.id;
    const { contaId, valor } = req.body;

    const resultado = await depositar({ userId, contaId, valor });
    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

async function sacarConta(req, res) {
  try {
    const userId = req.user.id;
    const { contaId, valor } = req.body;

    const resultado = await sacar({ userId, contaId, valor });
    return res.status(201).json(resultado);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  depositarConta,
  sacarConta
};
