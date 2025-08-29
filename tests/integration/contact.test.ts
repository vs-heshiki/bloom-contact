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

  it('should return validation error when all fields are missing', async () => {
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

  it('should return validation error when email is invalid', async () => {
    const payload = {
      name: 'Ana',
      address: 'São Paulo',
      email: 'invalid-email',
      phones: ['11999999999'],
    };
    const created = await request(app).post('/contacts').send(payload);
    expect(created.status).toBe(400);
    expect(created.body).toMatchObject({
      error: 'Validation error',
      details: ['"email" must be a valid email'],
    });
  });

  it('should return an error when phone number is duplicated', async () => {
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

  it('should return all contacts created', async () => {
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

  it('should return a filtered list of contacts', async () => {
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

  it('should update a contact successfully', async () => {
    const created = await request(app)
      .post('/contacts')
      .send({
        name: 'John Doe',
        address: 'Old Street',
        email: 'john@example.com',
        phones: ['+1234567890'],
      });

    const id = created.body.contact.id;

    const updated = await request(app)
      .put(`/contacts/${id}`)
      .send({
        name: 'John Doe Updated',
        address: 'New Street',
        email: 'john.updated@example.com',
        phones: ['+1111111111'],
      });

    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({
      id,
      name: 'John Doe Updated',
      address: 'New Street',
      email: 'john.updated@example.com',
    });
  });

  it('should return 400 if id is invalid', async () => {
    const res = await request(app).put('/contacts/abc').send({
      name: 'Invalid',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid id/);
  });

  it('should return 400 if validation fails', async () => {
    const created = await request(app)
      .post('/contacts')
      .send({
        name: 'Jane Doe',
        address: 'Street',
        email: 'jane@example.com',
        phones: ['+2222222222'],
      });

    const id = created.body.contact.id;

    const res = await request(app).put(`/contacts/${id}`).send({
      email: 'not-an-email',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Validation error/);
  });
});
