const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./user-model');

let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./user-service'); 
});

afterAll(async () => {
    app.close();
    await mongoServer.stop();
});

describe('User Service Validation', () => {
  it('should add a new user on POST /adduser', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should reject a user without a username', async () => {
    const newUser = {
      password: 'testpassword',
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Missing required field: username');
  });

  it('should reject a user without a password', async () => {
    const newUser = {
      username: 'testuser2',
    };

    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Missing required field: password');
  });

  it('should not allow adding a user with an existing username', async () => {
    const newUser = {
      username: 'testuser',
      password: 'testpassword',
    };
    // Intentamos añadir el mismo usuario otra vez
    const response = await request(app).post('/adduser').send(newUser);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('User already exists');
  });

  it('should get all users correctly', async () => {
    const response = await request(app).get('/user');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('username');
    expect(response.body[0]).toHaveProperty('createdAt');
  });
  it('should update an existing user', async () => {
    // Primero añadir un usuario para tener una ID con la que trabajar
    let newUser = { username: 'updateUser', password: 'password123' };
    let user = await request(app).post('/adduser').send(newUser);
    let userId = user.body._id;

    // Intentar actualizar el nombre de usuario
    const updatedData = { username: 'updatedUser' };
    const response = await request(app).patch(`/user/${userId}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'updatedUser');
  });
  it('should handle deletion of a non-existent user correctly', async () => {
    const invalidUserId = 'nonexistentUserId';
    // Espiar el método findById y simular que no encuentra el usuario
    jest.spyOn(User, 'findById').mockImplementationOnce((id) => {
      return Promise.resolve(null);  // Simula que no se encontró el usuario
    });

    const response = await request(app).delete(`/user/${invalidUserId}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');

    // Restaurar el método original después de la prueba
    jest.restoreAllMocks();
  });
  it('should handle internal server error when getting users', async () => {
    // Simular un fallo en la base de datos aquí o forzar un error
    jest.spyOn(User, 'find').mockImplementationOnce(() => {
      throw new Error('Internal server error');
    });

    const response = await request(app).get('/user');
    expect(response.status).toBe(500);
    expect(response.body.error).toContain('Internal Server Error');
  });




});
