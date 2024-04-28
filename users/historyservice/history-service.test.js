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
  test('should reject history entry with missing data', async () => {
    const userData = {
      username: 'testuser',
      // Falta NumPreguntasJugadas y NumAcertadas
    };

    const response = await request(app).post('/savehistory').send(userData);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Error al guardar el historial');  // Mensaje de error debe ser específico para la falta de datos
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
  test('should handle non-existent username on get history', async () => {
    const invalidUsername = "noexisto";
    const response = await request(app).get(`/gethistory/${invalidUsername}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('No se encontro historial para este usuario');
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
describe('/getranking endpoint', () => {
  beforeEach(async () => {
    // Limpiar la colección antes de cada test para evitar contaminación de datos
    await History.deleteMany({});
  });

  test('should handle insufficient data for rankings', async () => {
    const response = await request(app).get('/getranking');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);  // Espera un array vacío si no hay datos suficientes para el ranking
  });

  test('should return a correct ranking of players based on their scores', async () => {
    // Crear entradas de historial para múltiples usuarios
    await History.create([
      { username: 'user1', NumJugadas: 10, NumPreguntasJugadas: 50, NumAcertadas: 25, NumFalladas: 25 },
      { username: 'user2', NumJugadas: 6, NumPreguntasJugadas: 30, NumAcertadas: 15, NumFalladas: 15 },
      { username: 'user3', NumJugadas: 4, NumPreguntasJugadas: 20, NumAcertadas: 10, NumFalladas: 10 }
    ]);

    const response = await request(app).get('/getranking');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
    expect(response.body[0].username).toBe('user1');
    expect(response.body[1].username).toBe('user2');
    expect(response.body[2].username).toBe('user3');
  });

  test('should correctly calculate posterior probabilities in rankings', async () => {
    // Crear entradas específicas para verificar el cálculo de las probabilidades a posteriori
    await History.create([
      { username: 'user4', NumJugadas: 20, NumPreguntasJugadas: 100, NumAcertadas: 90, NumFalladas: 10 },
      { username: 'user5', NumJugadas: 20, NumPreguntasJugadas: 100, NumAcertadas: 60, NumFalladas: 40 }
    ]);

    const response = await request(app).get('/getranking');
    expect(response.status).toBe(200);
    // Comprobar que el cálculo de la probabilidad a posteriori coloca a user4 antes que a user5
    expect(response.body[0].username).toBe('user4');
    expect(response.body[1].username).toBe('user5');
    expect(response.body[0].posteriorProbability).toBeGreaterThan(response.body[1].posteriorProbability);
  });

  test('should handle server error during ranking calculation', async () => {
    // Simular un error en la base de datos
    jest.spyOn(History, 'find').mockImplementationOnce(() => Promise.reject(new Error('Internal server error')));

    const response = await request(app).get('/getranking');
    expect(response.status).toBe(500);
    expect(response.body.message).toContain('Internal server error');
    // Restaurar mocks para evitar afectar otros tests
    jest.restoreAllMocks();
  });
});