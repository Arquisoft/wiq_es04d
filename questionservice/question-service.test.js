const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Question = require('./question-model');

let mongoServer;
let app;

async function loadTestData() {
  const questions = require('./test-data');
  Question.insertMany(questions);
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./question-service');
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Question Service', () => {
  test('Should generate questions /generatequestions', async () => {
    const response = await request(app).get('/generatequestions')
    expect(response.status).toBe(200);
    const questionCount = await Question.countDocuments();
    expect(questionCount).toBe(20);
  });

  test('Should get questions /getquestions', async () => {
    const response = await request(app).get('/getquestions')
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(5);
  });
});
