const wikiCall = require("./wikiCall");
const Question = require('../question-model')

class WikiQuery {

    /**
     * Obtiene preguntas de wikidata a partir de una plantilla.
     * @param {Object} template - La plantilla sacada de templates.json.
     * @param {Number} limitValue - El límite de preguntas a obtener (número entero). Debe ser mayor a 3.
     * @returns preguntas con el formato de api_questionservice.txt
     */
    static async getQuestions(template, limitValue) {
        let queryAnswerVar = '?answerLabel'
        if (template.year===true){
            queryAnswerVar = '(YEAR(?answer) AS ?answerLabel)'
        }
        const query = `
        SELECT DISTINCT ?questionLabel ${queryAnswerVar}
        WHERE {
            ?question wdt:P31 ${template.questionVariable}; # Tipo de entidad: question
            ${template.answerVariable} ?answer. # Propiedad: Tiene por answer
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],es". }
          }
        LIMIT ${limitValue}`;
        const results = await wikiCall(query)
        const questions = [];
        // Generar una pregunta por cada elemento de results
        for (let i = 0; i < results.length; i++) {
            let questionVar = results[i]['questionLabel'].value;
            // La pregunta es la de la plantilla pero reemplazando __x__ por la variable de pregunta
            let question = template.question.replace("__x__", questionVar);
            let answerVar = results[i]['answerLabel'].value;
            let answers = [{ answer: answerVar, correct: true }];
            let copy_results = results.slice(); // copia para no modificar la lista original
            copy_results.splice(i, 1); // Eliminar la fila que lleva la pregunta correcta
            while (answers.length < 4) {
                let randomIndex = Math.floor(Math.random() * copy_results.length);
                let distractorAnswerVar = copy_results[randomIndex]['answerLabel'].value;
                answers.push({ answer: distractorAnswerVar, correct: false })
                copy_results.splice(randomIndex, 1); // Eliminar la fila elegida para que no vuelva a salir
            }
            let shuffledAnswers = this.#shuffleArray(answers); // Mezclar la respuestas para que la primera no sea siempre la correcta
            questions.push(new Question({ question: question, answers: shuffledAnswers, questionCategory: template.questionCategory }));
        }

        return questions;
    }

    /**
     * Mezcla los elementos del array.
     * @param {list} array 
     * @returns array con los elementos mezclados.
     */
    static #shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Genera un índice aleatorio entre 0 e i
            [array[i], array[j]] = [array[j], array[i]]; // Intercambia los elementos en las posiciones i y j
        }
        return array;
    }
}

module.exports = WikiQuery