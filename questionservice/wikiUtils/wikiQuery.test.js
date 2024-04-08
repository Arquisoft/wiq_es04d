// wikiQuery.test.js
const wikiCall = require("./wikiCall");
const Question = require("../question-model");
const WikiQuery = require("./WikiQuery");

// Mock de wikiCall y Question
jest.mock("./wikiCall");
jest.mock("../question-model");

describe("WikiQuery", () => {
    beforeEach(() => {
        // Limpiar mocks antes de cada test
        jest.clearAllMocks();
    });

    it("debería obtener preguntas de Wikidata y formatearlas correctamente", async () => {
        // Preparar datos simulados que se esperan de wikiCall
        const mockResults = [
            { questionLabel: { value: "¿Cuál es la capital de Francia?" }, answerLabel: { value: "París" } },
            { questionLabel: { value: "¿Cuál es la capital de Francia?1" }, answerLabel: { value: "París1" } },
            { questionLabel: { value: "¿Cuál es la capital de Francia?2" }, answerLabel: { value: "París2" } },
            { questionLabel: { value: "¿Cuál es la capital de Francia?3" }, answerLabel: { value: "París3" } }
            // Agrega más elementos según necesites para tu prueba
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
        expect(wikiCall).toHaveBeenCalledWith(expect.stringMatching(/SELECT\s+\?questionLabel\s+\?answerLabel\s+WHERE/gm));

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
});
