// wikiQuery.test.js
const wikiCall = require("./wikiCall");
const Question = require("../question-model");
const WikiQuery = require("./wikiQuery");

// Mock de wikiCall y Question
jest.mock("./wikiCall");
jest.mock("../question-model");

describe("WikiQuery", () => {
    beforeEach(() => {
        // Limpiar mocks antes de cada test
        jest.clearAllMocks();
        Question.mockImplementation(({ question, answers, questionCategory }) => ({
            question,
            answers,
            questionCategory
        }));
    });

    it("debería obtener preguntas de Wikidata y formatearlas correctamente", async () => {
        // Preparar datos simulados que se esperan de wikiCall
        const mockResults = [
            { questionLabel: { value: "¿Cuál es la capital de Francia?" }, answerLabel: { value: "París" } },
            { questionLabel: { value: "¿Cuál es la capital de Francia?1" }, answerLabel: { value: "París1" } },
            { questionLabel: { value: "¿Cuál es la capital de Francia?2" }, answerLabel: { value: "París2" } },
            { questionLabel: { value: "¿Cuál es la capital de Francia?3" }, answerLabel: { value: "París3" } }
        ];

        // Configurar wikiCall para retornar datos simulados
        wikiCall.mockResolvedValue(mockResults);

        // Simular una plantilla y un límite
        const template = {
            questionVariable: "?q",
            answerVariable: "?a",
            question: "¿Cuál es la capital de __x__?",
            questionCategory: "Geografía"
        };
        const limitValue = 5;

        // Llamada al método a testear
        const questions = await WikiQuery.getQuestions(template, limitValue);

        // Verificar que wikiCall fue llamado correctamente
        expect(wikiCall).toHaveBeenCalledWith(expect.stringMatching(/SELECT DISTINCT\s+\?questionLabel\s+\?answerLabel\s+WHERE/gm));

        expect(wikiCall).toHaveBeenCalledTimes(1);

        // Verificar que Question fue llamado con los argumentos esperados
        expect(Question).toHaveBeenCalledWith(expect.objectContaining({
            question: expect.any(String),
            answers: expect.arrayContaining([expect.objectContaining({ correct: true })]),
            questionCategory: template.questionCategory
        }));
        expect(Question).toHaveBeenCalledTimes(mockResults.length);

        // Verifica que la cantidad de preguntas y sus formatos sean los esperados
        expect(questions).toHaveLength(mockResults.length);

    });
    it("debería reemplazar respuestas con formato URL y manejar respuestas repetidas usando respuestas de resguardo", async () => {
        const mockResults = [
            { questionLabel: { value: "¿Cuál es el río más largo?" }, answerLabel: { value: "http://amazon.com" } },
            { questionLabel: { value: "¿Cuál es el río más largo?1" }, answerLabel: { value: "http://nile.com" } },
            { questionLabel: { value: "¿Cuál es el río más largo?2" }, answerLabel: { value: "Nilo" } },
            { questionLabel: { value: "¿Cuál es el río más largo?3" }, answerLabel: { value: "Nilo" } } // respuesta repetida
        ];

        // Mock para las respuestas de resguardo
        const mockBackupAnswers = [
            { itemLabel: { value: "Mississippi" } },
            { itemLabel: { value: "Yangtsé" } }
        ];

        wikiCall.mockImplementation(query => {
            if (query.includes("LIMIT 100")) {
                return Promise.resolve(mockBackupAnswers);
            } else {
                return Promise.resolve(mockResults);
            }
        });

        const template = {
            questionVariable: "?q",
            answerVariable: "?a",
            question: "¿Cuál es el río más largo de __x__?",
            year: false,
            questionCategory: "Geografía"
        };
        const limitValue = 4;

        const questions = await WikiQuery.getQuestions(template, limitValue, mockBackupAnswers);

        // Verificar que las respuestas URL son reemplazadas por 'No hay'
        expect(questions[0].answers.some(ans => ans.answer === "No hay")).toBe(true);
        expect(questions[1].answers.some(ans => ans.answer === "No hay")).toBe(true);

        // Verificar que las respuestas repetidas son reemplazadas por respuestas de resguardo
        expect(questions.some(q => q.answers.some(ans => ans.answer === "Mississippi" || ans.answer === "Yangtsé"))).toBe(true);

        // Verificar el llamado correcto a wikiCall
        expect(wikiCall).toHaveBeenCalledTimes(1);
    });

});
