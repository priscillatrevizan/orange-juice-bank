const { handleBuyTransaction } = require('./transactions.service');

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

module.exports = { createTransaction };
