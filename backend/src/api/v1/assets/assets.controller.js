const prisma = require('../../../config/database');

const AssetsController = {
  // Buscar todas as ações
  async getAllStocks(req, res) {
    try {
      const stocks = await prisma.stock.findMany();
      return res.status(200).json(stocks);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar ações' });
    }
  },

  // Buscar todos os produtos de renda fixa
  async getAllFixedIncome(req, res) {
    try {
      const fixedIncome = await prisma.fixedIncome.findMany();
      return res.status(200).json(fixedIncome);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar renda fixa' });
    }
  },

  // Buscar todos os ativos (opcional, pode juntar stocks e fixedIncome)
  async getAllAssets(req, res) {
    try {
      const stocks = await prisma.stock.findMany();
      const fixedIncome = await prisma.fixedIncome.findMany();
      return res.status(200).json({ stocks, fixedIncome });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao buscar ativos' });
    }
  },

  // Buscar ação por ID
  async getStockById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const stock = await prisma.stock.findUnique({ where: { id } });
      if (!stock) {
        return res.status(404).json({ error: 'Ação não encontrada' });
      }
      return res.status(200).json(stock);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao buscar ação' });
    }
  },

  // Buscar renda fixa por ID
  async getFixedIncomeById(req, res) {
    try {
      const { id } = req.params;
      const fixed = await prisma.fixedIncome.findUnique({ where: { id } });
      if (!fixed) {
        return res.status(404).json({ error: 'Produto de renda fixa não encontrado' });
      }
      return res.status(200).json(fixed);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao buscar renda fixa' });
    }
  },
};

module.exports = AssetsController;