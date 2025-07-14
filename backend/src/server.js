const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

// --- BLOCO TEMPORÁRIO PARA TESTE DE CONEXÃO ---
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient(); // Instancia o Prisma Client

// async function testDbConnection() {
//   console.log('--- Iniciando teste de conexão Prisma pela Aplicação ---');
//   console.log('DATABASE_URL que a aplicação está vendo:', process.env.DATABASE_URL);
//   try {
//     await prisma.$connect(); // Tenta conectar ao DB
//     console.log('✅ Conexão com o banco de dados estabelecida com sucesso pelo Prisma na Aplicação!');
//   } catch (e) {
//     console.error('❌ Erro ao conectar ao banco de dados pelo Prisma na Aplicação:', e);
//     console.error('Detalhes do erro:', e.message);
//     // Não é necessário process.exit(1) neste ponto se você quiser que o servidor continue
//   } finally {
//     // Pode desconectar aqui se não for usar o 'prisma' diretamente no server.js
//     // Mas o Prisma Client gerencia suas próprias conexões, então pode deixar conectado
//     // await prisma.$disconnect();
//     console.log('--- Fim do teste de conexão Prisma pela Aplicação ---');
//   }
// }

// testDbConnection(); // Chame a função de teste na inicialização do servidor
// --- FIM DO BLOCO TEMPORÁRIO ---

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
