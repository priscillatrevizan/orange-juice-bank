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

  // Buscar todos os fundos de investimento
  async getAllFunds(req, res) {
    try {
      const funds = await prisma.fundInvestment.findMany();
      return res.status(200).json(funds);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar fundos de investimento' });
    }
  },

  // Buscar todos os ativos (opcional, pode juntar stocks e fixedIncome)
  async getAllAssets(req, res) {
    try {
      const stocks = await prisma.stock.findMany();
      const fixedIncome = await prisma.fixedIncome.findMany();
      // funds é opcional, mas pode ser incluído
      let funds = [];
      try {
        funds = await prisma.fundInvestment.findMany();
      } catch (e) {
        funds = [];
      }
      return res.status(200).json({
        stocks: Array.isArray(stocks) ? stocks : [],
        fixedIncome: Array.isArray(fixedIncome) ? fixedIncome : [],
        funds: Array.isArray(funds) ? funds : []
      });
    } catch (error) {
      return res.status(200).json({
        stocks: [],
        fixedIncome: [],
        funds: []
      });
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

  // Buscar fundo de investimento por ID
  async getFundById(req, res) {
    try {
      const { id } = req.params;
      const fund = await prisma.fundInvestment.findUnique({ where: { id } });
      if (!fund) {
        return res.status(404).json({ error: 'Fundo de investimento não encontrado' });
      }
      return res.status(200).json(fund);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao buscar fundo de investimento' });
    }
  },
};

module.exports = AssetsController;