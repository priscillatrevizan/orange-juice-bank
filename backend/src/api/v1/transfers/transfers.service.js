const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function realizarTransferencia({ userId, contaOrigemId, contaDestinoId, valor, tipo }) {
  if (!valor || valor <= 0) throw new Error('Valor da transferência inválido.');

  if (!contaOrigemId || !contaDestinoId) throw new Error('Contas origem e destino são obrigatórias.');
  if (contaOrigemId === contaDestinoId) throw new Error('Contas origem e destino devem ser diferentes.');

  const contaOrigem = await prisma.account.findUnique({ where: { id: contaOrigemId } });
  const contaDestino = await prisma.account.findUnique({ where: { id: contaDestinoId } });

  if (!contaOrigem || !contaDestino) throw new Error('Conta de origem ou destino não encontrada.');

  const mesmaPessoa = contaOrigem.userId === contaDestino.userId;

  if (tipo === 'transferencia_interna') {
    if (!mesmaPessoa) throw new Error('Transferência interna deve ser entre contas do mesmo usuário.');
    if (contaOrigem.balance < valor) throw new Error('Saldo insuficiente na conta de origem.');

    // Debita e credita
    await prisma.account.update({
      where: { id: contaOrigemId },
      data: { balance: { decrement: valor } },
    });

    await prisma.account.update({
      where: { id: contaDestinoId },
      data: { balance: { increment: valor } },
    });

    // Registra movimentação
    return await prisma.movement.create({
      data: {
        tipo,
        valor,
        contaOrigemId,
        contaDestinoId,
        userId,
        descricao: 'Transferência interna entre contas',
      },
    });
  }

  if (tipo === 'transferencia_externa') {
    if (mesmaPessoa) throw new Error('Transferência externa deve ser entre usuários diferentes.');
    if (contaOrigem.type !== 'corrente' || contaDestino.type !== 'corrente') {
      throw new Error('Somente contas corrente podem ser usadas para transferências externas.');
    }

    const taxa = valor * 0.005;
    const total = valor + taxa;

    if (contaOrigem.balance < total) throw new Error('Saldo insuficiente para cobrir valor + taxa.');

    await prisma.account.update({
      where: { id: contaOrigemId },
      data: { balance: { decrement: total } },
    });

    await prisma.account.update({
      where: { id: contaDestinoId },
      data: { balance: { increment: valor } },
    });

    return await prisma.movimentacao.create({
      data: {
        tipo,
        valor,
        contaOrigemId,
        contaDestinoId,
        userId,
        descricao: `Transferência externa com taxa de 0.5% (${taxa.toFixed(2)})`,
      },
    });
  }

  throw new Error('Tipo de transferência inválido.');
}

const comprarAcoes = async ({ userId, contaInvestimentoId, stockId, quantidade }) => {
  if (!quantidade || quantidade <= 0) throw new Error('Quantidade inválida.');
  if (!stockId) throw new Error('ID do ativo não informado.');

  const conta = await prisma.account.findUnique({ where: { id: contaInvestimentoId } });
  if (!conta || conta.type !== 'investimento') throw new Error('Conta de investimento não encontrada.');

  const stock = await prisma.stock.findUnique({ where: { id: stockId } });
  if (!stock) throw new Error('Ativo não encontrado.');

  const precoUnitario = stock.precoAtual || stock.preco || 0;
  const totalCompra = precoUnitario * quantidade;
  const taxaCorretagem = totalCompra * 0.01;
  const valorFinal = totalCompra + taxaCorretagem;

  if (conta.balance < valorFinal) throw new Error('Saldo insuficiente na conta de investimento.');

  // Debita valor total (compra + taxa)
  await prisma.account.update({
    where: { id: contaInvestimentoId },
    data: { balance: { decrement: valorFinal } },
  });

  // Registra transação
  const transacao = await prisma.transaction.create({
    data: {
      userId,
      stockId,
      fixedIncomeId: null,
      type: 'buy',
      amount: quantidade,
    },
  });

  // Registra movimentação
  await prisma.movement.create({
    data: {
      userId,
      contaOrigemId: contaInvestimentoId,
      contaDestinoId: null,
      tipo: 'compra_acao',
      valor: valorFinal,
      descricao: `Compra de ${quantidade}x ${stock.nome} com corretagem de 1%`,
    },
  });

  return transacao;
};


module.exports = { realizarTransferencia };
