const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function realizarTransferencia({ userId, contaOrigemId, contaDestinoId, valor, tipo }) {
  if (!valor || valor <= 0) throw new Error('Valor da transferência inválido.');

  if (!contaOrigemId || !contaDestinoId) throw new Error('Contas origem e destino são obrigatórias.');
  if (contaOrigemId === contaDestinoId) throw new Error('Contas origem e destino devem ser diferentes.');

  const contaOrigem = await prisma.account.findUnique({ where: { id: contaOrigemId } });
  const contaDestino = await prisma.account.findUnique({ where: { id: contaDestinoId } });

  if (!contaOrigem || !contaDestino) throw new Error('Saldo insuficiente ou conta de origem/destino não encontrada.');

  const mesmaPessoa = contaOrigem.userId === contaDestino.userId;

  if (tipo === 'transferencia_interna') {
    if (!mesmaPessoa) throw new Error('Transferência interna deve ser entre contas do mesmo usuário.');
    if (contaOrigem.balance < valor) throw new Error('Saldo insuficiente.');

    // Validação: se for de investimento para corrente, checar pendências
    if (contaOrigem.type === 'investimento' && contaDestino.type === 'corrente') {
      // Busca por movimentações do tipo compra ou venda com status pendente
      const pendencias = await prisma.movement.findFirst({
        where: {
          userId,
          tipo: { in: ['compra', 'venda'] },
          // status: 'pendente' // descomente se existir campo status
        },
      });
      if (pendencias) {
        throw new Error('Não é possível transferir: existem operações pendentes de compra ou venda de ativos.');
      }
    }

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

    if (contaOrigem.balance < total) throw new Error('Saldo insuficiente.');

    await prisma.account.update({
      where: { id: contaOrigemId },
      data: { balance: { decrement: total } },
    });

    await prisma.account.update({
      where: { id: contaDestinoId },
      data: { balance: { increment: valor } },
    });

    return await prisma.movement.create({
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


// Funções wrapper para transferências interna e externa
async function realizarTransferenciaInterna({ userId, contaOrigemId, contaDestinoId, valor }) {
  return realizarTransferencia({ userId, contaOrigemId, contaDestinoId, valor, tipo: 'transferencia_interna' });
}

async function realizarTransferenciaExterna({ userId, contaOrigemId, contaDestinoId, valor }) {
  return realizarTransferencia({ userId, contaOrigemId, contaDestinoId, valor, tipo: 'transferencia_externa' });
}


module.exports = { realizarTransferencia, realizarTransferenciaInterna, realizarTransferenciaExterna };
