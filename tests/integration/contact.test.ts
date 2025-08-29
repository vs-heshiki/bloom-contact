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

  it('return validation error when address is missing', async () => {
    const payload = {
      name: 'Ana',
      email: 'ana@example.com',
      phones: ['11999999999'],
    };
    const created = await request(app).post('/contacts').send(payload);
    expect(created.status).toBe(400);
  });

  it('return validation error when all fields are missing', async () => {
    const payload = {};
    const created = await request(app).post('/contacts').send(payload);
    expect(created.status).toBe(400);
    expect(created.body).toEqual({
      error: 'Validation error',
      details: [
        '"name" is required',
        '"address" is required',
        '"email" is required',
        '"phones" is required',
      ],
    });
  });
});
