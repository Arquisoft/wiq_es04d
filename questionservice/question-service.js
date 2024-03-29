const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8003;

// Importamos la función desde questionTemplates.js
const templates = require('./templates.json')
// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

const WikiQuery = require('./wikiUtils/wikiQuery');
const Question = require('./question-model');

async function generateQuestions() {
    const template = templates.capital_of;
    const newQuestions = await WikiQuery.getQuestions(template, 20);
    newQuestions.forEach(q => {
        console.log(q.question);
        console.log(q.answers);
    });
    Question.insertMany(newQuestions);
}

app.get('/getquestions', async (req, res) => {
    try {

        // Realizar consulta de agregación para obtener una pregunta aleatoria
        const randomQuestions = await Question.aggregate([
            { $sample: { size: 5 } } // Selecciona una pregunta aleatoria
        ]);

        //const questionAndAnswer = await getQuestionTemplate(); // Obtenemos el json de pregunta y sus respuestas
        console.log(randomQuestions); // Imprime questionAndAnswer en la consola

        res.json(randomQuestions); //Devolvemos a la gateway el json
    } catch (error) {
        console.log("Error getting question from database: " + error);
        console.log("Adding new questions to database...");
        await generateQuestions();
        console.log("Questions added. Getting random question...");
        const randomQuestions = await Question.aggregate([
            { $sample: { size: 5 } } // Selecciona una pregunta aleatoria
        ]);
        console.log("Random questions selected: " + randomQuestions); // Imprime questionAndAnswer en la consola
        res.json(randomQuestions); //Devolvemos a la gateway el json
    }

});

app.get('/generatequestions', async (req, res) => {
    try {
        await generateQuestions();
        res.json({ status: 'OK' });
    } catch (error) {
        res.status(error.response.status).json({ error: error.response.data.error });
    }

});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});


