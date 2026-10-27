const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

beforeAll(async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/xxmy_barber_test_db';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Pruebas de la API de AXMY Barber Shop', () => {
  
  test('GET /api/estilos debe responder con una lista de elementos', async () => {
    const res = await request(app).get('/api/estilos');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });

  test('POST /api/auth/login con credenciales inválidas debe denegar el acceso', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'correo_falso@axmy.com', password: 'wrongpassword' });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

});