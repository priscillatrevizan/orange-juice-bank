const { depositar, sacar, buscarContasPorUsuario } = require('./accounts.service');

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

// Buscar todas as contas de um usuário
async function getContasByUser(req, res) {
  try {
    // Sempre prioriza o usuário autenticado se não houver userId nos params
    // Só permite acesso autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }
    const userId = req.user.id;
    console.log('DEBUG CONTAS: req.user =', req.user, '| userId =', userId);
    const contas = await buscarContasPorUsuario(userId);
    return res.status(200).json(Array.isArray(contas) ? contas : []);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  depositarConta,
  sacarConta,
  getContasByUser
};
