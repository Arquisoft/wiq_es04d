const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Question = require('./question-model');

// Importamos y mockeamos el módulo wikiQuery.js
jest.mock('./wikiUtils/wikiQuery.js', () => ({
  getQuestions: jest.fn().mockImplementation(async (template, count) => {
    const questions = [];

    // Simula generar documentos de pregunta
    for (let i = 0; i < count; i++) {
      questions.push({
        question: `Pregunta ${i + 1}`,
        answers: [
          { answer: `Respuesta ${i + 1}`, correct: true },
          { answer: `Respuesta ${i + 2}`, correct: false },
          { answer: `Respuesta ${i + 3}`, correct: false },
          { answer: `Respuesta ${i + 4}`, correct: false }
        ],
        questionCategory: "testCategory"
      });
    }

    return questions;
  })
}));

let mongoServer;
let app;

beforeAll(async () => {
  // Inicializamos un servidor de MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;

  // Importamos la aplicación Express de question-service
  app = require('./question-service');
});

afterAll(async () => {
  // Cerramos la aplicación Express y detenemos el servidor de MongoDB en memoria
  app.close();
  await mongoServer.stop();
});

afterEach(async () => {
  // Eliminar todos los documentos de la colección Question después de cada prueba
  await Question.deleteMany({});
});

// Bloque de pruebas para el servicio de preguntas
describe('Question Service', () => {
  // Prueba para el endpoint /generatequestions
  test('Should generate questions /generatequestions', async () => {
    const response = await request(app).get('/generatequestions');
    expect(response.status).toBe(200);

    // Verifica que se hayan generado 100 preguntas
    const questionCount = await Question.countDocuments();
    expect(questionCount).toBe(100);
  });

  // Prueba para el endpoint /question/randoms
  test('Should get questions /question/randoms', async () => {
    const response = await request(app).get('/question/randoms');
    expect(response.status).toBe(200);

    // Verifica que se devuelvan 5 preguntas
    expect(response.body.length).toBe(5);
  });

  // Prueba para el endpoint GET /question
  test('Should get all questions GET /question', async () => {
    const newQuestionData = [new Question({
      question: '¿Cuál es la capital de Francia?',
      answers: [
        { answer: 'París', correct: true },
        { answer: 'Madrid', correct: false },
        { answer: 'Berlín', correct: false },
        { answer: 'Londres', correct: false }
      ],
      questionCategory: 'Geografía'
    }),
    new Question({
      question: '¿Cuál es la capital de España?',
      answers: [
        { answer: 'París', correct: false },
        { answer: 'Madrid', correct: true },
        { answer: 'Berlín', correct: false },
        { answer: 'Londres', correct: false }
      ],
      questionCategory: 'Geografía'
    })];

    await Question.insertMany(newQuestionData);

    const response = await request(app).get('/question');
    expect(response.status).toBe(200);

    // Verifica que se devuelvan 2 preguntas
    expect(response.body.length).toBe(2);
  });

  // Prueba para el endpoint /question
  test('Should create a new question', async () => {
    const newQuestionData = {
      question: '¿Cuál es la capital de Francia?',
      answers: [
        { answer: 'París', correct: true },
        { answer: 'Madrid', correct: false },
        { answer: 'Berlín', correct: false },
        { answer: 'Londres', correct: false }
      ],
      questionCategory: 'Geografía'
    };

    // Realiza una solicitud POST al endpoint /question con los datos de la nueva pregunta
    const response = await request(app)
      .post('/question')
      .send(newQuestionData);

    // Verifica que la solicitud se haya completado con éxito (código de estado 201)
    expect(response.status).toBe(201);

    // Verifica que la respuesta incluya la nueva pregunta creada
    expect(response.body).toMatchObject(newQuestionData);

    // Verifica que la pregunta se haya guardado en la base de datos
    const savedQuestion = await Question.findOne({ question: newQuestionData.question });
    expect(savedQuestion).toBeTruthy();
  });

  // Prueba para el endpoint PATCH /question/:id
  test('Should update a question by ID', async () => {
    // Crear una nueva pregunta en la base de datos para actualizarla luego
    const newQuestion = new Question({
      question: '¿Cuál es la capital de Francia?',
      answers: [
        { answer: 'París', correct: true },
        { answer: 'Madrid', correct: false },
        { answer: 'Berlín', correct: false },
        { answer: 'Londres', correct: false }
      ],
      questionCategory: 'Geografía'
    });
    await newQuestion.save();

    // Datos actualizados para la pregunta
    const updatedQuestionData = {
      question: '¿Cuál es la capital de España?',
      answers: [
        { answer: 'Madrid', correct: true },
        { answer: 'París', correct: false },
        { answer: 'Berlín', correct: false },
        { answer: 'Londres', correct: false }
      ],
      questionCategory: 'Geografía'
    };

    // Realizar una solicitud PATCH al endpoint /question/:id con los datos actualizados
    const response = await request(app)
      .patch(`/question/${newQuestion._id}`)
      .send(updatedQuestionData);

    // Verificar que la solicitud se haya completado con éxito (código de estado 200)
    expect(response.status).toBe(200);

    // Verificar que la respuesta incluya la pregunta actualizada
    expect(response.body).toMatchObject(updatedQuestionData);

    // Verificar que la pregunta se haya actualizado en la base de datos
    const updatedQuestion = await Question.findById(newQuestion._id);
    expect(updatedQuestion).toMatchObject(updatedQuestionData);
  });

  // Prueba para el endpoint DELETE /question/:id
  test('Should delete a question by ID', async () => {
    // Crear una nueva pregunta en la base de datos para eliminarla luego
    const newQuestion = new Question({
      question: '¿Cuál es la capital de Alemania?',
      answers: [
        { answer: 'Berlín', correct: true },
        { answer: 'Madrid', correct: false },
        { answer: 'París', correct: false },
        { answer: 'Londres', correct: false }
      ],
      questionCategory: 'Geografía'
    });
    await newQuestion.save();

    // Realizar una solicitud DELETE al endpoint /question/:id con el ID de la pregunta creada
    const response = await request(app)
      .delete(`/question/${newQuestion._id}`);

    // Verificar que la solicitud se haya completado con éxito (código de estado 200)
    expect(response.status).toBe(200);

    // Verificar que la pregunta ha sido eliminada de la base de datos
    const deletedQuestion = await Question.findById(newQuestion._id);
    expect(deletedQuestion).toBeNull();
  });


});
