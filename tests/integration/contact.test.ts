import request from 'supertest';
import sequelize from '../../src/infra/database';
import app from '../../src/app';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Contacts API', () => {
  it('creates and lists a contact', async () => {
    const payload = {
      name: 'Ana',
      address: 'São Paulo',
      email: 'ana@example.com',
      phones: ['11999999999'],
    };
    const created = await request(app).post('/contacts').send(payload);
    expect(created.status).toBe(201);
  });
});
