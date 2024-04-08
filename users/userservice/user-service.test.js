const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

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

});
