const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function create(data) {
  const { name, email, cpf, birthDate } = data;
  // Permite receber tx para transação
  const prismaClient = data.tx || prisma;

  const exists = await prismaClient.user.findFirst({
    where: {
      OR: [{ email }, { cpf }],
    },
  });

  if (exists) {
    throw new Error('Usuário com este e-mail ou CPF já existe.');
  }

  return await prismaClient.user.create({
    data: {
      name,
      email,
      cpf,
      birthDate: new Date(birthDate),
    },
  });
}


async function getAll() {
  return await prisma.user.findMany();
}

module.exports = {
  create,
  getAll,
};
