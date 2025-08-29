import request from 'supertest';
import sequelize from '@/infra/database';
import app from '@/app';

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

  it('should returns an error when phone number is duplicated', async () => {
    const payload = {
      name: 'Ana',
      address: 'São Paulo',
      email: 'ana@example.com',
      phones: ['11999999999', '11999999999'],
    };
    const created = await request(app).post('/contacts').send(payload);
    expect(created.status).toBe(400);
    expect(created.body).toEqual({
      error: 'Phone numbers must be unique',
    });
  });

  it('should returns all contacts created', async () => {
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/contacts')
        .send({
          name: 'John Doe',
          address: 'New York, USA',
          email: 'HbO7o@example.com',
          phones: ['+1234567890', '+9876543210'],
        });
    }

    const getAll = await request(app).get('/contacts');
    expect(getAll.status).toBe(200);
    expect(Array.isArray(getAll.body)).toBe(true);
    expect(getAll.body.length).toBe(4);
    expect(getAll.body[0]).toHaveProperty('phones');
    expect(Array.isArray(getAll.body[0].phones)).toBe(true);
  });

  it('should returns a filtered list of contacts', async () => {
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post('/contacts')
        .send({
          name: `John Doe ${i}`,
          address: 'New York, USA',
          email: `user${i}@example.com`,
          phones: ['+1234567890', '+9876543210'],
        });
    }

    const getfiltered = await request(app).get('/contacts').query({
      name: 'John Doe 2',
    });
    expect(getfiltered.status).toBe(200);
    expect(Array.isArray(getfiltered.body)).toBe(true);
    expect(getfiltered.body.length).toBe(1);
    expect(getfiltered.body[0].name).toBe('John Doe 2');
  });
});
