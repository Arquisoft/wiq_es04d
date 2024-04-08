const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const User = require('./auth-model');

let mongoServer;
let app;

//test user
const user = {
  username: 'testuser',
  password: 'testpassword',
};

async function addUser(user){
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = new User({
    username: user.username,
    password: hashedPassword,
  });

  await newUser.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./auth-service'); 
  //Load database with initial conditions
  await addUser(user);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Auth Service', () => {
  // Existing test
  it('Should perform a login operation /login', async () => {
    const response = await request(app).post('/login').send(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  // New tests
  it('Should reject login with incorrect credentials', async () => {
    const response = await request(app).post('/login').send({ username: 'testuser', password: 'wrongpassword' });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('Should require username and password fields for login', async () => {
    const response = await request(app).post('/login').send({ username: 'testuser' }); // Missing password
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });

  it('Should validate a JWT token', async () => {
    // First, login to get a valid token
    const loginResponse = await request(app).post('/login').send(user);
    expect(loginResponse.status).toBe(200);
    const { token } = loginResponse.body;

    // Now, validate the token
    const validationResponse = await request(app).get(`/validate/${token}`);
    expect(validationResponse.status).toBe(200);
    expect(validationResponse.body).toHaveProperty('valid', true);
  });

  it('Should reject an invalid JWT token', async () => {
    const validationResponse = await request(app).get('/validate/wrongtoken');
    expect(validationResponse.status).toBe(200);
    expect(validationResponse.body).toHaveProperty('valid', false);
  });
});

