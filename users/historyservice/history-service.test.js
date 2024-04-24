const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const History = require('./history-model');

let mongodb;
let app;

beforeAll(async () => {
  mongodb = await MongoMemoryServer.create();
  const uri = await mongodb.getUri();
  process.env.MONGODB_URI = uri;
  app = require('./history-service');
});

afterAll(async () => {
  app.close();
  await mongodb.stop();
});

describe('POST /savehistory', () => {
  test('should save history entry for a new user that plays a game', async () => {
    const userData = {
      username: 'testuser',
      NumPreguntasJugadas: 5,
      NumAcertadas: 3
    };

    const response = await request(app).post('/savehistory').send(userData);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(userData.username);
    expect(response.body.NumJugadas).toBe(1);
    expect(response.body.NumPreguntasJugadas).toBe(userData.NumPreguntasJugadas);
    expect(response.body.NumAcertadas).toBe(userData.NumAcertadas);
    expect(response.body.NumFalladas).toBe(userData.NumPreguntasJugadas - userData.NumAcertadas);

  });

  test('should update history entry for an existing user', async () => {
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

    const response = await request(app).post('/savehistory').send(userData)

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(userData.username);
    expect(response.body.NumJugadas).toBe(2); // Verificar que se ha incrementado el número de jugadas
    expect(response.body.NumPreguntasJugadas).toBe(10); // Verificar que se han añadido las nuevas preguntas jugadas
    expect(response.body.NumAcertadas).toBe(5); // Verificar que se han añadido las nuevas preguntas acertadas
    expect(response.body.NumFalladas).toBe(5); // Verificar que se han añadido las nuevas preguntas falladas
  });
});

describe('GET /gethistory', () => {
  test('should get history entry for an existing user', async () => {
    // Crear una entrada de historial existente en la base de datos
    await History.create({
      username: 'existinguser2',
      NumJugadas: 1,
      NumPreguntasJugadas: 5,
      NumAcertadas: 3,
      NumFalladas: 2
    });

    const response = await request(app).get('/gethistory').query({ username: 'existinguser2' })
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'NumJugadas','NumPreguntasJugadas','NumAcertadas','NumFalladas');
    expect(response.body.username).toBe('existinguser2');
    expect(response.body.NumJugadas).toBe(1);
    expect(response.body.NumPreguntasJugadas).toBe(5);
    expect(response.body.NumAcertadas).toBe(3);
    expect(response.body.NumFalladas).toBe(2);
  });

  test('should create new history entry for a non-existing user', async () => {
    const response = await request(app).get('/gethistory').query({ username: 'nonexistinguser' });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('nonexistinguser');
    expect(response.body.NumJugadas).toBe(0);
    expect(response.body.NumPreguntasJugadas).toBe(0);
    expect(response.body.NumAcertadas).toBe(0);
    expect(response.body.NumFalladas).toBe(0);
  });
});

describe('GET /gethistory/:username', () => {
  test('should get history entry for an existing user', async () => {
    // Crear una entrada de historial existente en la base de datos
    await History.create({
      username: 'existinguser2',
      NumJugadas: 1,
      NumPreguntasJugadas: 5,
      NumAcertadas: 3,
      NumFalladas: 2
    });

    const response = await request(app).get('/gethistory/existinguser2');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'NumJugadas','NumPreguntasJugadas','NumAcertadas','NumFalladas');
    expect(response.body.username).toBe('existinguser2');
    expect(response.body.NumJugadas).toBe(1);
    expect(response.body.NumPreguntasJugadas).toBe(5);
    expect(response.body.NumAcertadas).toBe(3);
    expect(response.body.NumFalladas).toBe(2);
  });

});