const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service');
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
afterAll(async () => {
  app.close();
});

jest.mock('axios');

describe('Gateway Service', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Restablece los mocks a su estado original antes de cada prueba
  });

  const mockSuccessResponse = (response) => {
    axios.post.mockResolvedValueOnce({ data: response });
    axios.get.mockResolvedValueOnce({ data: response });
    axios.delete.mockResolvedValueOnce({ data: response });
    axios.patch.mockResolvedValueOnce({ data: response });
  };

  const mockErrorResponse = (error) => {
    axios.post.mockRejectedValueOnce({ response: { status: error.status, data: { error: error.message } } });
    axios.get.mockRejectedValueOnce({ response: { status: error.status, data: { error: error.message } } });
    axios.delete.mockRejectedValueOnce({ response: { status: error.status, data: { error: error.message } } });
    axios.patch.mockRejectedValueOnce({ response: { status: error.status, data: { error: error.message } } });
  };

  it('should forward login request to auth service', async () => {
    mockSuccessResponse({ token: 'mockedToken' });

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  it('should forward add user request to user service', async () => {
    mockSuccessResponse({ userId: 'mockedUserId' });

    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });

  it('should handle errors from the auth service on login', async () => {
    mockErrorResponse({ status: 401, message: 'Unauthorized' });

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('should validate a token successfully', async () => {
    mockSuccessResponse({ valid: true });

    const response = await request(app)
      .get('/validate/mockedToken');

    expect(response.statusCode).toBe(200);
    expect(response.body.valid).toBe(true);
  });

  it('should handle validation error', async () => {
    mockErrorResponse({ status: 401, message: 'Invalid token' });

    const response = await request(app)
      .get('/validate/invalidToken');

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Invalid token');
  });

  it('should forward get random questions request to generate service', async () => {
    mockSuccessResponse([{ question: 'What is 2+2?' }]);

    const response = await request(app)
      .get('/question/randoms');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ question: 'What is 2+2?' }]);
  });

  it('should forward get questions request to generate service', async () => {
    mockSuccessResponse([{ question: 'What is 2+2?' }]);

    const response = await request(app)
      .get('/question');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ question: 'What is 2+2?' }]);
  });




  it('should forward create question request to generate service', async () => {
    mockSuccessResponse({ success: true, id: 'questionId' });

    const response = await request(app)
      .post('/question')
      .send({ question: 'What is 2+2?', answer: '4' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ success: true, id: 'questionId' });
  });

  it('should forward update question request to generate service', async () => {
    mockSuccessResponse({ status: 'OK' });

    const response = await request(app)
      .patch('/question/questionId')
      .send({ question: 'Updated Question?', answer: 'Updated Answer' });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  it('should forward save history request to history service', async () => {
    mockSuccessResponse({ success: true });

    const response = await request(app)
      .post('/savehistory')
      .send({ username: 'testuser', action: 'test action' });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should forward get history request to history service', async () => {
    mockSuccessResponse([{ action: 'test action', date: '2024-03-31' }]);

    const response = await request(app)
      .get('/gethistory?username=testuser');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ action: 'test action', date: '2024-03-31' }]);
  });



  it('should handle error getting random questions from generate service', async () => {
    mockErrorResponse({ status: 500, message: 'Error getting the questions' });

    const response = await request(app)
      .get('/question/randoms');

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Error getting the questions');
  });

  it('should handle error getting questions from generate service', async () => {
    mockErrorResponse({ status: 500, message: 'Error getting the questions' });

    const response = await request(app)
      .get('/question');

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Error getting the questions');
  });

  it('should handle error creating question in generate service', async () => {
    mockErrorResponse({ status: 500, message: 'Error creating the question' });

    const response = await request(app)
      .post('/question')
      .send({ question: 'New Question', answer: 'New Answer' });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Error creating the question');
  });

  it('should handle error updating question in generate service', async () => {
    mockErrorResponse({ status: 500, message: 'Error updating the question' });

    const response = await request(app)
      .patch('/question/nonexistentId')
      .send({ question: 'Updated Question', answer: 'Updated Answer' });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Error updating the question');
  });

  it('should handle error saving history in history service', async () => {
    mockErrorResponse({ status: 500, message: 'Error saving the history' });

    const response = await request(app)
      .post('/savehistory')
      .send({ username: 'testuser', action: 'test action' });

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Error saving the history');
  });

  it('should handle error getting history from history service with query', async () => {
    mockErrorResponse({ status: 500, message: 'Error getting the history' });

    const response = await request(app)
      .get('/gethistory?username=testuser');

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Error getting the history');
  });

  it('should propagate parameters correctly on user update request', async () => {
    mockSuccessResponse({ status: 'OK' });

    const response = await request(app)
        .patch('/user/userId')
        .send({ username: 'updatedUsername' });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });
  it('should ensure data consistency when retrieving user history', async () => {
    mockSuccessResponse({ username: 'user4', NumJugadas: 20, NumPreguntasJugadas: 100, NumAcertadas: 90, NumFalladas: 10 });

    const response = await request(app)
        .get('/history/testuser');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username', 'user4');
    expect(response.body).toHaveProperty('NumJugadas',20);
    expect(response.body).toHaveProperty('NumPreguntasJugadas',100);
    expect(response.body).toHaveProperty('NumAcertadas',90);
    expect(response.body).toHaveProperty('NumFalladas',10);
  });
  it('should forward delete user request to user service and handle response', async () => {
    mockSuccessResponse({ status: 'OK' });

    const response = await request(app)
        .delete('/user/12345');  // Supuesto ID de usuario

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  it('should forward delete question request to generate service and handle response', async () => {
    mockSuccessResponse({ status: 'OK' });

    const response = await request(app)
        .delete('/question/questionId123');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });


  it('should forward get ranking request to history service and return rankings', async () => {
    mockSuccessResponse([{ username: 'user1', score: 95 }, { username: 'user2', score: 85 }]);

    const response = await request(app)
        .get('/getranking');

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].username).toBe('user1');
    expect(response.body[0].score).toBe(95);
  });
  it('should handle error deleting user from user service', async () => {
    mockErrorResponse({ status: 404, message: 'User not found' });

    const response = await request(app)
        .delete('/user/nonexistentId');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('User not found');
  });
});
describe('User API Endpoints', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Clear previous mocks between tests
  });

  // Test for GET /user
  it('should retrieve user data successfully', async () => {
    const mockUserData = [{ id: 'user1', name: 'John Doe' }];
    axios.get.mockResolvedValueOnce({ data: mockUserData });

    const response = await request(app).get('/user');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUserData);
    expect(axios.get).toHaveBeenCalledWith(`${userServiceUrl}/user`);
  });

  it('should handle failure when retrieving user data', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404, data: { error: 'User not found' } } });

    const response = await request(app).get('/user');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  // Test for POST /user
  it('should create a user successfully', async () => {
    const newUser = { username: 'newuser', password: 'password123' };
    axios.post.mockResolvedValueOnce({ data: { userId: '12345' } });

    const response = await request(app).post('/user').send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.userId).toBe('12345');
    expect(axios.post).toHaveBeenCalledWith(`${userServiceUrl}/adduser`, newUser);
  });

  it('should handle failure when creating a user', async () => {
    const newUser = { username: 'newuser', password: 'password123' };
    axios.post.mockRejectedValueOnce({ response: { status: 500, data: { error: 'Error creating the user' } } });

    const response = await request(app).post('/user').send(newUser);

    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe('Error creating the user');
  });

  // Test for PATCH /user/:id
  it('should update user data successfully', async () => {
    const updates = { name: 'Jane Doe' };
    axios.patch.mockResolvedValueOnce({ data: { status: 'OK' } });

    const response = await request(app).patch('/user/1').send(updates);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(axios.patch).toHaveBeenCalledWith(`${userServiceUrl}/user/1`, updates);
  });

  it('should handle failure when updating user data', async () => {
    const updates = { name: 'Jane Doe' };
    axios.patch.mockRejectedValueOnce({ response: { status: 404, data: { error: 'User not found' } } });

    const response = await request(app).patch('/user/1').send(updates);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('User not found');
  });

  // Test for DELETE /user/:id
  it('should delete a user successfully', async () => {
    axios.delete.mockResolvedValueOnce({ data: { status: 'OK' } });

    const response = await request(app).delete('/user/1');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(axios.delete).toHaveBeenCalledWith(`${userServiceUrl}/user/1`, {});
  });

  it('should handle failure when deleting a user', async () => {
    axios.delete.mockRejectedValueOnce({ response: { status: 404, data: { error: 'User not found' } } });

    const response = await request(app).delete('/user/1');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('User not found');
  });
});

