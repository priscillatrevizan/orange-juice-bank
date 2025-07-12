const prisma = require('../../../config/database');

const AssetsController = {
  async getAllAssets(req, res) {
    try {
      const assets = await prisma.stock.findMany();
      return res.status(200).json(assets);
    } catch (error) {
      console.error('Erro ao buscar ativos:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar ativos' });
    }
  }
};

module.exports = AssetsController;
