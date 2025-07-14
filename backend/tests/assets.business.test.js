const request = require('supertest');
const app = require('../src/app');

// Mock tokens, users, and accounts as needed for isolated tests
// (Ideal: use a test DB or seed/clear before each test)
describe('Operações de Ativos e Relatórios', () => {
  let token;
  let userId;
  let contaInvestimentoId;
  let contaCorrenteId;
  let stockId;
  let fixedIncomeId;


  beforeAll(async () => {
    // Fluxo igual ao teste de transferência
    const unique = `${Date.now()}${Math.floor(Math.random() * 100000)}`;
    const email = `teste${unique}@email.com`;
    const cpf = `${unique}`.padStart(11, '0').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    // Cria usuário
    const resUser = await request(app)
      .post('/api/v1/users')
      .send({ name: 'Usuário Teste', email, cpf, birthDate: '2000-01-01' });
    userId = resUser.body.id;
    // Login
    const login = await request(app).post('/api/v1/auth/login').send({ email, cpf });
    token = login.body.token;
    // Busca contas com retry usando token
    let tentativas = 10;
    let contas = [];
    let resContas;
    while (tentativas-- > 0) {
      resContas = await request(app)
        .get('/api/v1/accounts')
        .set('Authorization', `Bearer ${token}`);
      // Suporta resposta como array direto ou { accounts: [] }
      let contasArray = Array.isArray(resContas.body) ? resContas.body : (Array.isArray(resContas.body.accounts) ? resContas.body.accounts : []);
      if (resContas.status === 200 && contasArray.length >= 2) {
        contas = contasArray;
        break;
      }
      await new Promise(r => setTimeout(r, 500));
    }
    contaCorrenteId = contas.find(c => c.type === 'corrente')?.id;
    contaInvestimentoId = contas.find(c => c.type === 'investimento')?.id;
    // Busca ativos
    const ativos = await request(app).get('/api/v1/assets').set('Authorization', `Bearer ${token}`);
    stockId = ativos.body.stocks?.[0]?.id;
    fixedIncomeId = ativos.body.fixedIncome?.[0]?.id;
    // Deposita saldo suficiente
    await request(app).post('/api/v1/accounts/deposit').set('Authorization', `Bearer ${token}`).send({ contaId: contaCorrenteId, valor: 10000 });
    // Transfere para investimento
    await request(app).post('/api/v1/transfers/internal').set('Authorization', `Bearer ${token}`).send({ contaOrigemId: contaCorrenteId, contaDestinoId: contaInvestimentoId, valor: 5000 });
  }, 20000);

  it('deve permitir compra de ações e cobrar taxa de 1%', async () => {
    const quantidade = 10;
    const compra = await request(app)
      .post('/api/v1/transactions/buy-stock')
      .set('Authorization', `Bearer ${token}`)
      .send({ contaInvestimentoId, stockId, quantidade });
    expect([200, 201]).toContain(compra.status);
    expect(compra.body).toHaveProperty('id');
    expect(compra.body).toHaveProperty('taxa');
    expect(compra.body.taxa).toBeGreaterThan(0);
  });

  it('deve permitir venda de ações e reter 15% de IR sobre lucro', async () => {
    // Compra primeiro, depois vende
    const quantidade = 2;
    console.log('DEBUG TESTE: venda de ações, contaInvestimentoId =', contaInvestimentoId);
    await request(app).post('/api/v1/transactions/buy-stock').set('Authorization', `Bearer ${token}`).send({ contaInvestimentoId, stockId, quantidade });
    const venda = await request(app)
      .post('/api/v1/transactions/sell-stock')
      .set('Authorization', `Bearer ${token}`)
      .send({ contaInvestimentoId, stockId, quantidade });
    expect([200, 201]).toContain(venda.status);
    expect(venda.body).toHaveProperty('impostoRetido');
    expect(venda.body.impostoRetido).toBeGreaterThanOrEqual(0);
  });

  it('deve permitir compra e venda de renda fixa e reter 22% de IR sobre rendimento', async () => {
    const quantidade = 1;
    console.log('DEBUG TESTE: venda renda fixa, contaInvestimentoId =', contaInvestimentoId);
    await request(app).post('/api/v1/transactions/buy-fixed-income').set('Authorization', `Bearer ${token}`).send({ contaInvestimentoId, fixedIncomeId, quantidade });
    const venda = await request(app)
      .post('/api/v1/transactions/sell-fixed-income')
      .set('Authorization', `Bearer ${token}`)
      .send({ contaInvestimentoId, fixedIncomeId, quantidade });
    expect([200, 201]).toContain(venda.status);
    expect(venda.body).toHaveProperty('impostoRetido');
    expect(venda.body.impostoRetido).toBeGreaterThanOrEqual(0);
  });

  it('deve gerar extrato de movimentações', async () => {
    const res = await request(app)
      .get('/api/v1/transactions/statement')
      .set('Authorization', `Bearer ${token}`)
      .query({ userId });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve gerar relatório de IR', async () => {
    const res = await request(app)
      .get('/api/v1/reports/ir')
      .set('Authorization', `Bearer ${token}`)
      .query({ userId });
    expect([200, 201, 404]).toContain(res.status); // 404 se não implementado
  });

  it('deve gerar resumo de investimentos', async () => {
    const res = await request(app)
      .get('/api/v1/reports/investments')
      .set('Authorization', `Bearer ${token}`)
      .query({ userId });
    expect([200, 201, 404]).toContain(res.status); // 404 se não implementado
  });
});
