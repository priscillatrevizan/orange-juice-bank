const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Compra de ações ou renda fixa
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

// Lista as transações de um usuário
async function listUserTransactions(userId) {
  return await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      stock: true,
      fixedIncome: true,
    },
  });
}

// Lista o extrato do usuário com filtros opcionais
async function listExtrato({ userId, type, account, startDate, endDate }) {
  const filters = { userId };

  if (type) filters.type = type;

  if (startDate || endDate) {
    filters.createdAt = {};
    if (startDate) filters.createdAt.gte = new Date(startDate);
    if (endDate) filters.createdAt.lte = new Date(endDate);
  }

  // Futuramente adicionar um campo 'accountType' se houver uma tabela de contas separadas

  return await prisma.transaction.findMany({
    where: filters,
    orderBy: { createdAt: 'desc' },
    include: {
      stock: true,
      fixedIncome: true,
    },
  });
}


module.exports = { handleBuyTransaction, listUserTransactions, listExtrato };
