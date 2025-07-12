const prisma = require('../../../config/database');

async function getAllAssets() {
  const stocks = await prisma.asset.findMany({
    where: { type: 'stock' }
  });

  const fixedIncome = await prisma.asset.findMany({
    where: { type: 'fixedIncome' }
  });

  return { stocks, fixedIncome };
}

module.exports = {
  getAllAssets,
};
