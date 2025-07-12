const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // Caminhos dos arquivos
  const usersPath = path.join(__dirname, 'seed-data', 'users-mock.json');
  const assetsPath = path.join(__dirname, 'seed-data', 'assets-mock.json');

  // Leitura dos arquivos
  const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8')).users;
  const { stocks, fixedIncome } = JSON.parse(fs.readFileSync(assetsPath, 'utf-8'));

  console.log('Inserindo usuários...');
  for (const user of usersData) {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        birthDate: new Date(user.birthDate),
      },
    });
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
