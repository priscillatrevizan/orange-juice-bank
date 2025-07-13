const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Compra de ações ou renda fixa
async function handleBuyTransaction({ userId, stockId, fixedIncomeId, amount, type }) {
  if (!amount || amount <= 0) throw new Error('Quantidade inválida.');
  if (!stockId && !fixedIncomeId) throw new Error('Informe um ativo (stockId ou fixedIncomeId).');
  if (stockId && fixedIncomeId) throw new Error('Informe apenas um ativo.');

  // 1. Obter conta investimento do usuário
  const contaInvestimento = await prisma.account.findFirst({
    where: {
      userId,
      type: 'investimento',
    },
  });
  if (!contaInvestimento) throw new Error('Conta de investimento não encontrada.');

  // 2. Buscar ativo
  let ativo;
  let preco = 0;
  let taxa = 0;

  if (stockId) {
    ativo = await prisma.stock.findUnique({ where: { id: stockId } });
    if (!ativo) throw new Error('Ação não encontrada.');
    preco = ativo.currentPrice;
    taxa = (preco * amount) * 0.01; // 1% taxa de corretagem
  }

  if (fixedIncomeId) {
    ativo = await prisma.fixedIncome.findUnique({ where: { id: fixedIncomeId } });
    if (!ativo) throw new Error('Renda fixa não encontrada.');
    preco = ativo.minimumInvestment;
    taxa = 0; // sem taxa de corretagem
  }

  const totalCompra = preco * amount + taxa;

  // 3. Verifica saldo suficiente
  if (contaInvestimento.balance < totalCompra) {
    throw new Error(`Saldo insuficiente. Necessário: R$ ${totalCompra.toFixed(2)}`);
  }

  // 4. Efetuar a compra dentro de uma transação Prisma
  return await prisma.$transaction(async (tx) => {
    // 4.1 Debitar da conta
    await tx.account.update({
      where: { id: contaInvestimento.id },
      data: { balance: { decrement: totalCompra } },
    });

    // 4.2 Registrar movimentação
    await tx.movement.create({
      data: {
        tipo: 'compra',
        valor: totalCompra,
        contaOrigemId: contaInvestimento.id,
        userId,
        descricao: `Compra de ativo (${stockId ? ativo.symbol : ativo.name})`,
      },
    });

    // 4.3 Criar transação
    return tx.transaction.create({
      data: {
        userId,
        stockId: stockId || null,
        fixedIncomeId: fixedIncomeId || null,
        amount,
        type,
      },
    });
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

// Venda de ações
const venderAcoes = async ({ userId, contaInvestimentoId, stockId, quantidade }) => {
  if (!quantidade || quantidade <= 0) throw new Error('Quantidade inválida.');
  if (!stockId) throw new Error('ID do ativo não informado.');

  const conta = await prisma.account.findUnique({ where: { id: contaInvestimentoId } });
  if (!conta || conta.type !== 'investimento') throw new Error('Conta de investimento não encontrada.');

  const stock = await prisma.stock.findUnique({ where: { id: stockId } });
  if (!stock) throw new Error('Ativo não encontrado.');

  const precoVenda = stock.precoAtual || stock.preco || 0;
  const totalBruto = precoVenda * quantidade;
  const imposto = totalBruto * 0.15;
  const totalLiquido = totalBruto - imposto;

  // Credita na conta
  await prisma.account.update({
    where: { id: contaInvestimentoId },
    data: { balance: { increment: totalLiquido } },
  });

  // Registra transação
  const transacao = await prisma.transaction.create({
    data: {
      userId,
      stockId,
      fixedIncomeId: null,
      type: 'sell',
      amount: quantidade,
    },
  });

  // Registra movimentação
  await prisma.movement.create({
    data: {
      userId,
      contaOrigemId: null,
      contaDestinoId: contaInvestimentoId,
      tipo: 'venda_acao',
      valor: totalLiquido,
      descricao: `Venda de ${quantidade}x ${stock.nome} com IR de 15% (${imposto.toFixed(2)})`,
    },
  });

  return transacao;
};



module.exports = { handleBuyTransaction, listUserTransactions, listExtrato, venderAcoes };
