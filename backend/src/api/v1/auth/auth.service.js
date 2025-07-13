const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'orange-secret';

async function login(email, cpf) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.cpf !== cpf) {
    throw new Error('Credenciais inválidas');
  }

const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
  expiresIn: '1h'
});

  return token;
}

module.exports = { login };
