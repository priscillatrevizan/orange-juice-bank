const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function create(data) {
  const { name, email, cpf, birthDate } = data;

  const exists = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { cpf }],
    },
  });

  if (exists) {
    throw new Error('Usuário com este e-mail ou CPF já existe.');
  }

  return await prisma.user.create({
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
