const prisma = require('../../../config/database'); 

// Busca e separa ativos por tipo
async function getAllAssets() {
  const stocks = await prisma.asset.findMany({
    where: { type: 'stock' }
  });

  const fixedIncome = await prisma.asset.findMany({
    where: { type: 'fixedIncome' }
  });

  return { stocks, fixedIncome };
}

// Busca ativo por ID
async function getAssetById(id) {
  return await prisma.asset.findUnique({
    where: { id: Number(id) }
  });
}

module.exports = {
  getAllAssets,
  getAssetById 
};
