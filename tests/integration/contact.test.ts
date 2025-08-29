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
  it('should creates and lists a contact', async () => {
    const payload = {
      name: 'Ana',
      address: 'São Paulo',
      email: 'ana@example.com',
      phones: ['11999999999'],
    };
    const created = await request(app).post('/contacts').send(payload);
    expect(created.status).toBe(201);
  });

  it('should returns validation error when all fields are missing', async () => {
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

  it('should returns validation error when email is invalid', async () => {
    const payload = {
      name: 'Ana',
      address: 'São Paulo',
      email: 'invalid-email',
      phones: ['11999999999'],
    };
    const created = await request(app).post('/contacts').send(payload);
    expect(created.status).toBe(400);
    expect(created.body).toEqual({
      error: 'Validation error',
      details: ['"email" must be a valid email'],
    });
  });
});
