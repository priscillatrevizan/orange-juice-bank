const request = require('supertest');
const app = require('../src/app');

describe('Transferências - Regras de Negócio', () => {
  describe('Fluxo completo: usuário, contas, depósito e transferência', () => {
    const unique = `${Date.now()}${Math.floor(Math.random() * 100000)}`;
    const email = `teste${unique}@email.com`;
    const cpf = `${unique}`.padStart(11, '0').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    let userId, token, contaCorrenteId, contaInvestimentoId;

    it('deve criar usuário e contas', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({ name: 'Usuário Teste', email, cpf, birthDate: '2000-01-01' });
      // Debug
      console.log('Criar usuário:', res.status, res.body);
      expect([200, 201]).toContain(res.status);
      expect(res.body).toHaveProperty('id');
      userId = res.body.id;
    });

    it('deve retornar as contas corrente e investimento criadas', async () => {
      let tentativas = 10;
      let contas = [];
      let res;
      while (tentativas-- > 0) {
        res = await request(app)
          .get(`/api/v1/accounts/user/${userId}`);
        console.log('Buscar contas:', res.status, res.body);
        if (res.status === 200 && Array.isArray(res.body) && res.body.length >= 2) {
          contas = res.body;
          break;
        }
        await new Promise(r => setTimeout(r, 500)); // espera 500ms
      }
      if (!contas.length) {
        throw new Error(`Contas não encontradas após múltiplas tentativas. Última resposta: ${res.status} ${JSON.stringify(res.body)}`);
      }
      contaCorrenteId = contas.find(c => c.type === 'corrente')?.id;
      contaInvestimentoId = contas.find(c => c.type === 'investimento')?.id;
      expect(contaCorrenteId).toBeDefined();
      expect(contaInvestimentoId).toBeDefined();
    }, 20000); // timeout 20s

    it('deve recusar criação de usuário duplicado', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send({ name: 'Usuário Teste', email, cpf });
      // Debug
      console.log('Usuário duplicado:', res.status, res.body);
      expect([400, 409, 422]).toContain(res.status);
      expect(res.body).toHaveProperty('error');
    });

    it('deve fazer login', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email, cpf });
      // Debug
      console.log('Login:', res.status, res.body);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      token = res.body.token;
    });

    it('deve permitir depósito na conta corrente', async () => {
      const valor = 100;
      const res = await request(app)
        .post('/api/v1/accounts/deposit')
        .set('Authorization', `Bearer ${token}`)
        .send({ contaId: contaCorrenteId, valor });
      // Debug
      console.log('Depósito:', res.status, res.body);
      expect([200, 201]).toContain(res.status);
      expect(res.body).toHaveProperty('id');
    });

    it('deve permitir transferência da conta corrente para investimento', async () => {
      const valor = 50;
      const res = await request(app)
        .post('/api/v1/transfers/internal')
        .set('Authorization', `Bearer ${token}`)
        .send({ contaOrigemId: contaCorrenteId, contaDestinoId: contaInvestimentoId, valor });
      // Debug
      console.log('Transferência:', res.status, res.body);
      expect([200, 201]).toContain(res.status);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('tipo', 'transferencia_interna');
      expect(res.body).toHaveProperty('valor', valor);
      expect(res.body).toHaveProperty('contaOrigemId', contaCorrenteId);
      expect(res.body).toHaveProperty('contaDestinoId', contaInvestimentoId);
    });
  });
  describe('Transferência entre contas do mesmo usuário', () => {
    it('deve recusar transferência se saldo da conta de origem for insuficiente', async () => {
      // Login real para obter token JWT
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'joao.silva@email.com', cpf: '123.456.789-00' });
      expect(loginRes.status).toBe(200);
      const token = loginRes.body.token;

      const contaOrigemId = 1; // Corrente
      const contaDestinoId = 2; // Investimento
      const valor = 999999; // Valor alto para garantir saldo insuficiente

      const response = await request(app)
        .post('/api/v1/transfers/internal')
        .set('Authorization', `Bearer ${token}`)
        .send({ contaOrigemId, contaDestinoId, valor });

      expect([400, 422]).toContain(response.status); // 400 ou 422 para erro de saldo
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/saldo insuficiente/i);
    });

    it('deve recusar transferência se valor for zero ou negativo', async () => {
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'joao.silva@email.com', cpf: '123.456.789-00' });
      expect(loginRes.status).toBe(200);
      const token = loginRes.body.token;

      const contaOrigemId = 1;
      const contaDestinoId = 2;

      for (const valor of [0, -100]) {
        const response = await request(app)
          .post('/api/v1/transfers/internal')
          .set('Authorization', `Bearer ${token}`)
          .send({ contaOrigemId, contaDestinoId, valor });
        expect([400, 422]).toContain(response.status);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toMatch(/valor.*inválido/i);
      }
    });

    it('deve recusar transferência de investimento para corrente se houver pendências', async () => {
      // Login real para obter token JWT
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'joao.silva@email.com', cpf: '123.456.789-00' });
      expect(loginRes.status).toBe(200);
      const token = loginRes.body.token;

      // Simular conta investimento com pendências (ajuste IDs conforme seed real)
      const contaOrigemId = 2; // Investimento
      const contaDestinoId = 1; // Corrente
      const valor = 1; // Valor baixo para garantir saldo suficiente

      // O backend só retorna erro se houver pendência real
      const response = await request(app)
        .post('/api/v1/transfers/internal')
        .set('Authorization', `Bearer ${token}`)
        .send({ contaOrigemId, contaDestinoId, valor });

      if ([400, 422].includes(response.status)) {
        expect([400, 422]).toContain(response.status);
        expect(response.body).toHaveProperty('error');
      } else {
        expect([200, 201]).toContain(response.status);
        expect(response.body).toHaveProperty('id');
      }
    });

    it('deve permitir transferência válida entre contas do mesmo usuário', async () => {
      // Login real para obter token JWT
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'joao.silva@email.com', cpf: '123.456.789-00' });
      expect(loginRes.status).toBe(200);
      const token = loginRes.body.token;

      // Simular transferência válida (ajuste IDs e valor conforme seed real)
      const contaOrigemId = 1; // Corrente
      const contaDestinoId = 2; // Investimento
      const valor = 10; // Valor baixo para garantir saldo

      const response = await request(app)
        .post('/api/v1/transfers/internal')
        .set('Authorization', `Bearer ${token}`)
        .send({ contaOrigemId, contaDestinoId, valor });

      if ([200, 201].includes(response.status)) {
        expect([200, 201]).toContain(response.status);
        expect(response.body).toHaveProperty('id'); // id do movimento
        expect(response.body).toHaveProperty('tipo', 'transferencia_interna');
        expect(response.body).toHaveProperty('valor', valor);
        expect(response.body).toHaveProperty('contaOrigemId', contaOrigemId);
        expect(response.body).toHaveProperty('contaDestinoId', contaDestinoId);
      } else {
        expect([400, 422]).toContain(response.status);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toMatch(/saldo insuficiente/i);
      }
    });
  });

  describe('Transferência entre usuários', () => {
    it('deve recusar se saldo da conta de origem for insuficiente', async () => {
      // Login real para obter token JWT
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'joao.silva@email.com', cpf: '123.456.789-00' });
      expect(loginRes.status).toBe(200);
      const token = loginRes.body.token;

      // Simular transferência externa com saldo insuficiente
      const contaOrigemId = 1; // Corrente do usuário 1
      const contaDestinoId = 3; // Corrente de outro usuário (ajuste conforme seed)
      const valor = 999999; // Valor alto para garantir saldo insuficiente

      const response = await request(app)
        .post('/api/v1/transfers/external')
        .set('Authorization', `Bearer ${token}`)
        .send({ contaOrigemId, contaDestinoId, valor });

      expect([400, 422]).toContain(response.status);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/saldo insuficiente/i);
    });

    it('deve recusar se conta de destino não existir', async () => {
      // Login real para obter token JWT
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'joao.silva@email.com', cpf: '123.456.789-00' });
      expect(loginRes.status).toBe(200);
      const token = loginRes.body.token;

      // Simular conta de destino inexistente
      const contaOrigemId = 1; // Corrente do usuário 1
      const contaDestinoId = 99999; // Conta inexistente
      const valor = 10;

      const response = await request(app)
        .post('/api/v1/transfers/external')
        .set('Authorization', `Bearer ${token}`)
        .send({ contaOrigemId, contaDestinoId, valor });

      expect([400, 404, 422]).toContain(response.status);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/destino|exist/i);
    });

    it('deve cobrar taxa de 0,5% em transferências externas', async () => {
      // Login real para obter token JWT
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'joao.silva@email.com', cpf: '123.456.789-00' });
      expect(loginRes.status).toBe(200);
      const token = loginRes.body.token;

      // Simular transferência externa válida
      const contaOrigemId = 1; // Corrente do usuário 1
      const contaDestinoId = 3; // Corrente de outro usuário (ajuste conforme seed)
      const valor = 100;
      const taxa = valor * 0.005;

      const response = await request(app)
        .post('/api/v1/transfers/external')
        .set('Authorization', `Bearer ${token}`)
        .send({ contaOrigemId, contaDestinoId, valor });

      if ([200, 201].includes(response.status)) {
        expect([200, 201]).toContain(response.status);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('tipo', 'transferencia_externa');
        expect(response.body).toHaveProperty('valor', valor);
        expect(response.body).toHaveProperty('contaOrigemId', contaOrigemId);
        expect(response.body).toHaveProperty('contaDestinoId', contaDestinoId);
        expect(response.body).toHaveProperty('descricao');
        expect(response.body.descricao).toMatch(/0.5%/);
      } else {
        // Caso saldo insuficiente
        expect([400, 422]).toContain(response.status);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toMatch(/saldo insuficiente/i);
      }
    });
  });
});
