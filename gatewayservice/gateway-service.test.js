const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service'); 

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

describe('Gateway Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.endsWith('/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } else if (url.endsWith('/adduser')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
    }
  });

  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });
// Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
        .post('/adduser')
        .send({ username: 'newuser', password: 'newpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });

  it('should handle errors from the auth service on login', async () => {
    // Simula una respuesta de error del servicio de autenticación
    axios.post.mockRejectedValue({ response: { status: 401, data: { error: 'Unauthorized' } } });

    const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('should validate a token successfully', async () => {
    // Simula una respuesta exitosa del servicio de autenticación
    axios.get.mockResolvedValue({ data: { valid: true } });

    const response = await request(app)
        .get('/validate/mockedToken');

    expect(response.statusCode).toBe(200);
    expect(response.body.valid).toBe(true);
  });
  it('should handle validation error', async () => {
    // Simula una respuesta de error del servicio de autenticación
    axios.get.mockRejectedValue({ response: { status: 401, data: { error: 'Invalid token' } } });

    const response = await request(app)
        .get('/validate/invalidToken');

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Invalid token');
  });

  // Test for /getquestions endpoint
  it('should forward get questions request to generate service', async () => {
    axios.get.mockResolvedValue({ data: [{ question: 'What is 2+2?' }] });
    const response = await request(app)
        .get('/getquestions');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ question: 'What is 2+2?' }]);
  });

  // Test for /createquestion endpoint
  it('should forward create question request to generate service', async () => {
    axios.post.mockResolvedValue({ data: { success: true, id: 'questionId' } });
    const response = await request(app)
        .post('/createquestion')
        .send({ question: 'What is 2+2?', answer: '4' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ success: true, id: 'questionId' });
  });

  // Test for /updatequestion/:id endpoint
  it('should forward update question request to generate service', async () => {
    axios.put.mockResolvedValue({ status: 200 });
    const response = await request(app)
        .put('/updatequestion/questionId')
        .send({ question: 'Updated Question?', answer: 'Updated Answer' });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  // Test for /deletequestion/:id endpoint
  it('should forward delete question request to generate service', async () => {
    axios.delete.mockResolvedValue({ status: 200 });
    const response = await request(app)
        .put('/deletequestion/questionId');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  // Test for /savehistory endpoint
  it('should forward save history request to history service', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    const response = await request(app)
        .post('/savehistory')
        .send({ username: 'testuser', action: 'test action' });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Test for /gethistory endpoint
  it('should forward get history request to history service', async () => {
    axios.get.mockResolvedValue({ data: [{ action: 'test action', date: '2024-03-31' }] });
    const response = await request(app)
        .get('/gethistory?username=testuser');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ action: 'test action', date: '2024-03-31' }]);
  });

});