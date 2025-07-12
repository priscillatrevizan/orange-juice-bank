

async function createTransaction(req, res) {
  try {
    const userId = req.user.id;
    const { stockId, fixedIncomeId, amount, type } = req.body;

    if (!type || type !== 'buy') {
      return res.status(400).json({ error: 'Tipo de transação inválido' });
    }

    const transaction = await handleBuyTransaction({ userId, stockId, fixedIncomeId, amount, type });

    return res.status(201).json(transaction);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

const { handleBuyTransaction, listUserTransactions } = require('./transactions.service');

async function getUserTransactions(req, res) {
  try {
    const userId = req.user.id;
    const transactions = await listUserTransactions(userId);
    return res.json(transactions);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

const { listExtrato } = require('./transactions.service');

async function getUserExtrato(req, res) {
  try {
    const userId = req.user.id;
    const { type, account, startDate, endDate } = req.query;

    const extrato = await listExtrato({ userId, type, account, startDate, endDate });
    return res.json(extrato);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  createTransaction,
  getUserTransactions,
  getUserExtrato
};

