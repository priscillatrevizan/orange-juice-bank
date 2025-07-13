// Buscar todas as contas de um usuário
async function buscarContasPorUsuario(userId) {
  if (!userId) throw new Error('userId é obrigatório');
  return await prisma.account.findMany({
    where: { userId: Number(userId) },
    orderBy: { id: 'asc' }
  });
}
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Depositar
async function depositar({ userId, contaId, valor }) {
  if (!valor || valor <= 0) throw new Error('Valor inválido.');
  const conta = await prisma.account.findUnique({ where: { id: contaId } });

  if (!conta) {
    throw new Error('Conta não encontrada.');
  }
  if (conta.userId !== userId) {
    throw new Error('Conta não pertence ao usuário.');
  }
  if (conta.type !== 'corrente') {
    throw new Error('Depósito só é permitido em conta corrente.');
  }

  await prisma.account.update({
    where: { id: contaId },
    data: { balance: { increment: valor } },
  });

  return await prisma.movement.create({
    data: {
      tipo: 'deposito',
      valor,
      contaDestinoId: contaId,
      userId,
      descricao: 'Depósito em conta corrente',
    },
  });
}

// Sacar
async function sacar({ userId, contaId, valor }) {
  if (!valor || valor <= 0) throw new Error('Valor inválido.');
  const conta = await prisma.account.findUnique({ where: { id: contaId } });

  if (!conta || conta.userId !== userId || conta.type !== 'corrente') {
    throw new Error('Conta corrente inválida ou não pertence ao usuário.');
  }

  if (conta.balance < valor) throw new Error('Saldo insuficiente para saque.');

  await prisma.account.update({
    where: { id: contaId },
    data: { balance: { decrement: valor } },
  });

  return await prisma.movement.create({
    data: {
      tipo: 'saque',
      valor,
      contaOrigemId: contaId,
      userId,
      descricao: 'Saque em conta corrente',
    },
  });
}

module.exports = {
  depositar,
  sacar,
  buscarContasPorUsuario
};
