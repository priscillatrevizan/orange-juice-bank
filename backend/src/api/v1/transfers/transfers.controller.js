const { realizarTransferencia } = require('./transfers.service');

async function transferir(req, res) {
  try {
    const userId = req.user.id;
    const { contaOrigemId, contaDestinoId, valor, tipo } = req.body;

    const result = await realizarTransferencia({ userId, contaOrigemId, contaDestinoId, valor, tipo });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { transferir };
