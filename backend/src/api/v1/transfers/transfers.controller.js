
const { realizarTransferenciaInterna, realizarTransferenciaExterna } = require('./transfers.service');


async function transferirInterna(req, res) {
  try {
    const userId = req.user.id;
    const { contaOrigemId, contaDestinoId, valor } = req.body;
    const result = await realizarTransferenciaInterna({ userId, contaOrigemId, contaDestinoId, valor });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function transferirExterna(req, res) {
  try {
    const userId = req.user.id;
    const { contaOrigemId, contaDestinoId, valor } = req.body;
    const result = await realizarTransferenciaExterna({ userId, contaOrigemId, contaDestinoId, valor });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { transferirInterna, transferirExterna };
