const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./history-service');
const History = require('./history-model');

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongodb = new MongoMemoryServer();

beforeAll(async () => {
  const uri = await mongodb.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongodb.stop();
});

beforeEach(async () => {
  await History.deleteMany({});
});

describe('POST /savehistory', () => {
  it('should save history entry for a new user that plays a game', async () => {
    const userData = {
      username: 'testuser',
      NumPreguntasJugadas: 5,
      NumAcertadas: 3
    };

    const response = await request(app)
      .post('/savehistory')
      .send(userData)
      .expect(200);

    expect(response.body.username).toBe(userData.username);
    expect(response.body.NumJugadas).toBe(1);
    expect(response.body.NumPreguntasJugadas).toBe(userData.NumPreguntasJugadas);
    expect(response.body.NumAcertadas).toBe(userData.NumAcertadas);
    expect(response.body.NumFalladas).toBe(userData.NumPreguntasJugadas - userData.NumAcertadas);
  });

  it('should update history entry for an existing user', async () => {
    // Crear una entrada de historial existente en la base de datos
    await History.create({
      username: 'existinguser',
      NumJugadas: 1,
      NumPreguntasJugadas: 5,
      NumAcertadas: 3,
      NumFalladas: 2
    });

    const userData = {
      username: 'existinguser',
      NumPreguntasJugadas:5,
      NumAcertadas: 2
    };

    const response = await request(app)
      .post('/savehistory')
      .send(userData)
      .expect(200);

    expect(response.body.username).toBe(userData.username);
    expect(response.body.NumJugadas).toBe(2); // Verificar que se ha incrementado el número de jugadas
    expect(response.body.NumPreguntasJugadas).toBe(10); // Verificar que se han añadido las nuevas preguntas jugadas
    expect(response.body.NumAcertadas).toBe(5); // Verificar que se han añadido las nuevas preguntas acertadas
    expect(response.body.NumFalladas).toBe(5); // Verificar que se han añadido las nuevas preguntas falladas
  });
});

describe('GET /gethistory', () => {
  it('should get history entry for an existing user', async () => {
    // Crear una entrada de historial existente en la base de datos
    await History.create({
      username: 'existinguser',
      NumJugadas: 1,
      NumPreguntasJugadas: 5,
      NumAcertadas: 3,
      NumFalladas: 2
    });

    const response = await request(app)
      .get('/gethistory')
      .query({ username: 'existinguser' })
      .expect(200);

    expect(response.body.username).toBe('existinguser');
    expect(response.body.NumJugadas).toBe(1);
    expect(response.body.NumPreguntasJugadas).toBe(5);
    expect(response.body.NumAcertadas).toBe(3);
    expect(response.body.NumFalladas).toBe(2);
  });

  it('should create new history entry for a non-existing user', async () => {
    const response = await request(app)
      .get('/gethistory')
      .query({ username: 'nonexistinguser' })
      .expect(200);

    expect(response.body.username).toBe('nonexistinguser');
    expect(response.body.NumJugadas).toBe(0);
    expect(response.body.NumPreguntasJugadas).toBe(0);
    expect(response.body.NumAcertadas).toBe(0);
    expect(response.body.NumFalladas).toBe(0);
  });
});