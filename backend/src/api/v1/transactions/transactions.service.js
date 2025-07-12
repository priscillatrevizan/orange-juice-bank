const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function handleBuyTransaction({ userId, stockId, fixedIncomeId, amount, type }) {
  if (!amount || amount <= 0) {
    throw new Error('Quantidade inválida.');
  }

  if (!stockId && !fixedIncomeId) {
    throw new Error('Informe um ativo (stockId ou fixedIncomeId).');
  }

  if (stockId && fixedIncomeId) {
    throw new Error('Informe apenas um tipo de ativo por transação.');
  }

  // Verifica se o ativo existe
  if (stockId) {
    const stock = await prisma.stock.findUnique({ where: { id: stockId } });
    if (!stock) throw new Error('Ação não encontrada.');
  }

  if (fixedIncomeId) {
    const fixedIncome = await prisma.fixedIncome.findUnique({ where: { id: fixedIncomeId } });
    if (!fixedIncome) throw new Error('Renda fixa não encontrada.');
  }

  // Cria a transação
  return await prisma.transaction.create({
    data: {
      userId,
      stockId: stockId || null,
      fixedIncomeId: fixedIncomeId || null,
      amount,
      type,
    },
  });
}

module.exports = { handleBuyTransaction };
