const request = require('supertest');
const app = require('../src/app');

// ATENÇÃO: ajuste os dados de usuário e contas conforme o seed real do seu projeto!

describe('Fundos de Investimento - Fluxo de Negócio', () => {
  let token;
  let contaInvestimentoId;
  let fundId = 'FND001';

beforeAll(async () => {
  // Login para obter token
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'joao.silva@email.com', cpf: '123.456.789-00' });
  token = loginRes.body.token;

  // Buscar contas do usuário autenticado
  const contasRes = await request(app)
    .get('/api/v1/accounts')
    .set('Authorization', `Bearer ${token}`);
  const contasArray = Array.isArray(contasRes.body) ? contasRes.body : (Array.isArray(contasRes.body.accounts) ? contasRes.body.accounts : []);
  const contaInvest = contasArray.find(c => c.type === 'investimento');
  if (!contaInvest) {
    throw new Error('Conta de investimento não encontrada no array de contas: ' + JSON.stringify(contasArray));
  }
  contaInvestimentoId = contaInvest.id;
  // Garante saldo suficiente na conta de investimento
  // 1. Deposita saldo na conta corrente
  const contaCorrente = contasArray.find(c => c.type === 'corrente');
  if (!contaCorrente) throw new Error('Conta corrente não encontrada no array de contas: ' + JSON.stringify(contasArray));
  await request(app)
    .post('/api/v1/accounts/deposit')
    .set('Authorization', `Bearer ${token}`)
    .send({ contaId: contaCorrente.id, valor: 10000 });
  // 2. Transfere para conta investimento
  await request(app)
    .post('/api/v1/transfers/internal')
    .set('Authorization', `Bearer ${token}`)
    .send({ contaOrigemId: contaCorrente.id, contaDestinoId: contaInvestimentoId, valor: 5000 });
}, 20000);

  it('deve listar fundos de investimento', async () => {
    const res = await request(app)
      .get('/api/v1/assets/funds')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('deve comprar cotas de fundo de investimento', async () => {
    const res = await request(app)
      .post('/api/v1/transactions/buy-fund')
      .set('Authorization', `Bearer ${token}`)
      .send({ fundInvestmentId: fundId, quantidade: 2 });
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('fundInvestmentId');
    expect(res.body).toHaveProperty('amount', 2);
  });

  it('deve vender cotas de fundo de investimento', async () => {
    const res = await request(app)
      .post('/api/v1/transactions/sell-fund')
      .set('Authorization', `Bearer ${token}`)
      .send({ contaInvestimentoId, fundInvestmentId: fundId, quantidade: 1 });
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('fundInvestmentId');
    expect(res.body).toHaveProperty('amount', 1);
  });

  it('deve rejeitar compra de fundo com quantidade inválida', async () => {
    const res = await request(app)
      .post('/api/v1/transactions/buy-fund')
      .set('Authorization', `Bearer ${token}`)
      .send({ fundInvestmentId: fundId, quantidade: 0 });
    expect(res.status).toBe(400); // Corrigido para esperar erro 400
    expect(res.body).toHaveProperty('error');
  });

  it('deve rejeitar venda de fundo com quantidade inválida', async () => {
    const res = await request(app)
      .post('/api/v1/transactions/sell-fund')
      .set('Authorization', `Bearer ${token}`)
      .send({ contaInvestimentoId, fundInvestmentId: fundId, quantidade: 0 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
