const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Compra de ações, renda fixa ou fundo de investimento
async function handleBuyTransaction({ userId, stockId, fixedIncomeId, fundInvestmentId, amount, type }) {
  if (!amount || amount <= 0) throw new Error('Quantidade inválida.');
  const ativosInformados = [stockId, fixedIncomeId, fundInvestmentId].filter(Boolean);
  if (ativosInformados.length !== 1) throw new Error('Informe apenas um ativo (stockId, fixedIncomeId ou fundInvestmentId).');

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
  let descricao = '';

  if (stockId) {
    ativo = await prisma.stock.findUnique({ where: { id: stockId } });
    if (!ativo) throw new Error('Ação não encontrada.');
    preco = ativo.currentPrice;
    taxa = preco * amount * 0.01; // 1% taxa de corretagem
    descricao = `Compra de ação (${ativo.symbol})`;
  }

  if (fixedIncomeId) {
    ativo = await prisma.fixedIncome.findUnique({ where: { id: fixedIncomeId } });
    if (!ativo) throw new Error('Renda fixa não encontrada.');
    preco = ativo.minimumInvestment;
    taxa = 0; // sem taxa de corretagem
    descricao = `Compra de renda fixa (${ativo.name})`;
  }

  if (fundInvestmentId) {
    ativo = await prisma.fundInvestment.findUnique({ where: { id: fundInvestmentId } });
    if (!ativo) throw new Error('Fundo de investimento não encontrado.');
    preco = ativo.minimumInvestment;
    taxa = 0; // sem taxa de corretagem
    descricao = `Compra de fundo (${ativo.name})`;
  }

  const totalCompra = preco * amount + taxa;

  // 3. Verifica saldo suficiente
  if (contaInvestimento.balance < totalCompra) {
    throw new Error(`Saldo insuficiente. Necessário: R$ ${totalCompra.toFixed(2)}`);
  }

  // 4. Efetuar a compra dentro de uma transação Prisma
  return await prisma.$transaction(async tx => {
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
        descricao,
      },
    });

    // 4.3 Criar transação
    return tx.transaction.create({
      data: {
        userId,
        stockId: stockId || null,
        fixedIncomeId: fixedIncomeId || null,
        fundInvestmentId: fundInvestmentId || null,
        amount,
        type,
      },
    });
  });
}
// Venda de fundo de investimento
const venderFundo = async ({ userId, contaInvestimentoId, fundInvestmentId, quantidade }) => {
  if (!quantidade || quantidade <= 0) throw new Error('Quantidade inválida.');
  if (!fundInvestmentId) throw new Error('ID do fundo não informado.');

  const conta = await prisma.account.findUnique({ where: { id: contaInvestimentoId } });
  if (!conta || conta.type !== 'investimento') throw new Error('Conta de investimento não encontrada.');

  const fundo = await prisma.fundInvestment.findUnique({ where: { id: fundInvestmentId } });
  if (!fundo) throw new Error('Fundo de investimento não encontrado.');

  const precoVenda = fundo.minimumInvestment || 0;
  const totalBruto = precoVenda * quantidade;
  const imposto = totalBruto * 0.22; // 22% de IR (igual renda fixa)
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
      stockId: null,
      fixedIncomeId: null,
      fundInvestmentId,
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
      tipo: 'venda_fundo',
      valor: totalLiquido,
      descricao: `Venda de ${quantidade}x ${fundo.name} com IR de 22% (${imposto.toFixed(2)})`,
    },
  });

  // Retorno compatível com o teste
  return {
    id: transacao.id,
    fundInvestmentId,
    amount: quantidade,
    impostoRetido: imposto,
    totalLiquido,
    totalBruto
  };
};

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
  const filtersTx = { userId };
  const filtersMv = { userId };
  // Filtro de tipo (operation/tipo)
  if (type) {
    filtersTx.type = type;
    if (type === 'sell') {
      filtersMv.tipo = { in: ['venda_acao', 'venda_renda_fixa'] };
    } else {
      filtersMv.tipo = type;
    }
  }

  if (startDate || endDate) {
    const dateFilterTx = {};
    const dateFilterMv = {};
    if (startDate) {
      dateFilterTx.gte = new Date(startDate);
      dateFilterMv.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilterTx.lte = new Date(endDate);
      dateFilterMv.lte = new Date(endDate);
    }
    if (Object.keys(dateFilterTx).length > 0) {
      filtersTx.createdAt = dateFilterTx;
    }
    if (Object.keys(dateFilterMv).length > 0) {
      filtersMv.data = dateFilterMv;
    }
  }

  // 1. Buscar transações
  const transactions = await prisma.transaction.findMany({
    where: filtersTx,
    include: {
      stock: true,
      fixedIncome: true,
    },
  });

  const mappedTransactions = transactions.map((tx) => ({
    type: 'transaction',
    createdAt: tx.createdAt,
    amount: tx.amount,
    operation: tx.type,
    asset: tx.stock
      ? { type: 'stock', symbol: tx.stock.symbol }
      : { type: 'fixedIncome', name: tx.fixedIncome.name },
  }));

  // 2. Buscar movimentações financeiras
  const movements = await prisma.movement.findMany({
    where: filtersMv,
  });

  const mappedMovements = movements.map((mv) => ({
    type: 'movement',
    createdAt: mv.createdAt || mv.data,
    valor: mv.valor,
    tipo: mv.tipo,
    descricao: mv.descricao,
  }));

  // 3. Combina e ordena por data (decrescente)
  return [...mappedTransactions, ...mappedMovements].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

// Venda de ações
const venderAcoes = async ({ userId, contaInvestimentoId, stockId, quantidade }) => {

  if (!quantidade || quantidade <= 0) throw new Error('Quantidade inválida.');
  if (!stockId) throw new Error('ID do ativo não informado.');
  if (!contaInvestimentoId) throw new Error('ID da conta de investimento não informado.');

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

  // Retorno compatível com o teste
  return {
    id: transacao.id,
    impostoRetido: imposto,
    totalLiquido,
    totalBruto
  };
};

// Venda de renda fixa
const venderRendaFixa = async ({ userId, contaInvestimentoId, fixedIncomeId, quantidade }) => {

  if (!quantidade || quantidade <= 0) throw new Error('Quantidade inválida.');
  if (!fixedIncomeId) throw new Error('ID do ativo de renda fixa não informado.');
  if (!contaInvestimentoId) throw new Error('ID da conta de investimento não informado.');

  const conta = await prisma.account.findUnique({ where: { id: contaInvestimentoId } });
  if (!conta || conta.type !== 'investimento') throw new Error('Conta de investimento não encontrada.');

  const rendaFixa = await prisma.fixedIncome.findUnique({ where: { id: fixedIncomeId } });
  if (!rendaFixa) throw new Error('Ativo de renda fixa não encontrado.');

  const precoVenda = rendaFixa.minimumInvestment || 0;
  const totalBruto = precoVenda * quantidade;
  const imposto = totalBruto * 0.22; // 22% de IR
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
      stockId: null,
      fixedIncomeId,
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
      tipo: 'venda_renda_fixa',
      valor: totalLiquido,
      descricao: `Venda de ${quantidade}x ${rendaFixa.nome} com IR de 22% (${imposto.toFixed(2)})`,
    },
  });

  // Retorno compatível com o teste
  return {
    id: transacao.id,
    impostoRetido: imposto,
    totalLiquido,
    totalBruto
  };
};

module.exports = {
  handleBuyTransaction,
  listUserTransactions,
  listExtrato,
  venderAcoes,
  venderRendaFixa,
  venderFundo,
};
