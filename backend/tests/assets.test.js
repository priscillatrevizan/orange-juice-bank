const request = require('supertest');
const app = require('../src/app');

describe('GET /api/v1/assets', () => {
  it('deve retornar status 200 e um objeto com arrays de stocks e fixedIncome', async () => {
    const response = await request(app).get('/api/v1/assets');
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(Array.isArray(response.body.stocks)).toBe(true);
    expect(Array.isArray(response.body.fixedIncome)).toBe(true);
  });
});
