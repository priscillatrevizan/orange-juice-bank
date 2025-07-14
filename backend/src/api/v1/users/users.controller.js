const usersService = require('./users.service');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createUser(req, res) {
  try {
    // Criação atômica: usuário e contas em uma transação
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await usersService.create(req.body, tx);
      const contaCorrente = await tx.account.create({
        data: { userId: newUser.id, type: 'corrente', balance: 0 },
      });
      const contaInvest = await tx.account.create({
        data: { userId: newUser.id, type: 'investimento', balance: 0 },
      });
      return { newUser, contaCorrente, contaInvest };
    });
    console.log('Usuário criado:', result.newUser);
    console.log('Conta corrente criada:', result.contaCorrente);
    console.log('Conta investimento criada:', result.contaInvest);
    return res.status(201).json(result.newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(400).json({ error: error.message });
  }
}


async function getAllUsers(req, res) {
  try {
    const users = await usersService.getAll();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createUser,
  getAllUsers,
};

