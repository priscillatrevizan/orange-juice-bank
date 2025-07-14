async function buyFixedIncome(req, res) {
  try {
    const userId = req.user.id;
    const { contaInvestimentoId, fixedIncomeId, quantidade } = req.body;
    const result = await handleBuyTransaction({ userId, fixedIncomeId, amount: quantidade, type: 'buy' });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}



const { 
  handleBuyTransaction, 
  listUserTransactions, 
  listExtrato, 
  comprarAcoes, 
  venderAcoes, 
  venderRendaFixa, 
  venderFundo
} = require('./transactions.service');
// Comprar fundo de investimento
async function buyFund(req, res) {
  try {
    const userId = req.user.id;
    const { fundInvestmentId, quantidade } = req.body;
    const result = await handleBuyTransaction({ userId, fundInvestmentId, amount: quantidade, type: 'buy' });
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// Vender fundo de investimento
async function sellFund(req, res) {
  try {
    const userId = req.user.id;
    const { contaInvestimentoId, fundInvestmentId, quantidade } = req.body;
    const result = await venderFundo({ userId, contaInvestimentoId, fundInvestmentId, quantidade });
    // Garante que a resposta tenha a propriedade 'impostoRetido' se existir
    if (result && typeof result.impostoRetido === 'undefined') {
      result.impostoRetido = result.impostoRetido ?? (result.amount ? result.amount * 0.22 : 0);
    }
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

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

async function getUserTransactions(req, res) {
  try {
    const userId = req.user.id;
    const transactions = await listUserTransactions(userId);
    return res.json(transactions);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

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

async function buyStock(req, res) {
  try {
    const userId = req.user.id;
    const { stockId, quantidade } = req.body;
    // Corrige parâmetros para o service
    const result = await handleBuyTransaction({ userId, stockId, amount: quantidade, type: 'buy' });
    // Garante que a resposta tenha a propriedade 'taxa' se existir
    if (result && typeof result.taxa === 'undefined') {
      result.taxa = result.taxa ?? calcularTaxa(result); // função dummy, ajuste conforme sua lógica
    }
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function sellStock(req, res) {
  try {
    const userId = req.user.id;
    const { contaInvestimentoId, stockId, quantidade } = req.body;
    console.log('sellStock body:', req.body);
    const result = await venderAcoes({ userId, contaInvestimentoId, stockId, quantidade });
    // Garante que a resposta tenha a propriedade 'impostoRetido' se existir
    if (result && typeof result.impostoRetido === 'undefined') {
      result.impostoRetido = result.impostoRetido ?? calcularImposto(result); // função dummy, ajuste conforme sua lógica
    }
    return res.status(201).json(result);
  } catch (err) {
    console.error('sellStock error:', err);
    return res.status(400).json({ error: err.message });
  }
}


async function sellFixedIncome(req, res) {
  try {
    const userId = req.user.id;
    const { contaInvestimentoId, fixedIncomeId, quantidade } = req.body;
    console.log('sellFixedIncome body:', req.body);
    const result = await venderRendaFixa({ userId, contaInvestimentoId, fixedIncomeId, quantidade });
    // Garante que a resposta tenha a propriedade 'impostoRetido' se existir
    if (result && typeof result.impostoRetido === 'undefined') {
      result.impostoRetido = result.impostoRetido ?? calcularImposto(result); // função dummy, ajuste conforme sua lógica
    }
    return res.status(201).json(result);
  } catch (err) {
    console.error('sellFixedIncome error:', err);
    return res.status(400).json({ error: err.message });
  }
}

// Funções dummy para garantir a propriedade no response (ajuste conforme sua regra de negócio real)
function calcularTaxa(result) {
  // Exemplo: taxa de 1% do valor
  if (result && result.amount) return result.amount * 0.01;
  return 0;
}

function calcularImposto(result) {
  // Exemplo: imposto de 15% do valor
  if (result && result.amount) return result.amount * 0.15;
  return 0;
}


module.exports = {
  createTransaction,
  getUserTransactions,
  getUserExtrato,
  buyStock,
  sellStock,
  sellFixedIncome,
  buyFixedIncome
  ,buyFund
  ,sellFund
};
