const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // Limpa tabelas para evitar duplicidade e erro de foreign key
  await prisma.movement.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.fixedIncome.deleteMany();
  await prisma.fundInvestment.deleteMany();
  // Caminhos dos arquivos
  const usersPath = path.join(__dirname, 'seed-data', 'users-mock.json');
  const assetsPath = path.join(__dirname, 'seed-data', 'assets-mock.json');
  const fundsPath = path.join(__dirname, 'seed-data', 'funds-mock.json');

  // Leitura dos arquivos
  const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8')).users;
  const { stocks, fixedIncome } = JSON.parse(fs.readFileSync(assetsPath, 'utf-8'));
  const fundsData = JSON.parse(fs.readFileSync(fundsPath, 'utf-8'));

  console.log('Inserindo usuários...');
  for (const user of usersData) {
    // Verifica se o usuário já existe
    let createdUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!createdUser) {
      createdUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          cpf: user.cpf,
          birthDate: new Date(user.birthDate),
        },
      });
    }
    // Cria contas corrente e investimento se não existirem
    const contas = await prisma.account.findMany({ where: { userId: createdUser.id } });
    if (!contas.find(c => c.type === 'corrente')) {
      await prisma.account.create({ data: { userId: createdUser.id, type: 'corrente', balance: 0 } });
    }
    if (!contas.find(c => c.type === 'investimento')) {
      await prisma.account.create({ data: { userId: createdUser.id, type: 'investimento', balance: 0 } });
    }
  }

  console.log('Inserindo ações (stocks)...');
  for (const stock of stocks) {
    await prisma.stock.create({
      data: {
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector,
        currentPrice: stock.currentPrice,
        dailyVariation: stock.dailyVariation,
      },
    });
  }

  console.log('Inserindo renda fixa (fixed income)...');
  for (const item of fixedIncome) {
    await prisma.fixedIncome.create({
      data: {
        id: item.id,
        name: item.name,
        type: item.type,
        rate: item.rate,
        rateType: item.rateType,
        maturity: new Date(item.maturity),
        minimumInvestment: item.minimumInvestment,
      },
    });
  }

  console.log('Inserindo fundos de investimento...');
  for (const fund of fundsData) {
    await prisma.fundInvestment.create({
      data: {
        id: fund.id,
        name: fund.name,
        type: fund.type,
        description: fund.description,
        rate: fund.rate,
        rateType: fund.rateType,
        minimumInvestment: fund.minimumInvestment,
      },
    });
  }

  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
