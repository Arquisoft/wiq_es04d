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

        // Selecciona 'size' preguntas aleatorias
        let randomQuestions = await Question.aggregate([
            { $sample: { size: 5 } } 
        ]);

        if (randomQuestions.length === 0) {
            console.log("Not enough questions in database. Adding new ones...");
            await generateQuestions();
            randomQuestions = await Question.aggregate([
                { $sample: { size: 5 } } 
            ]);
        }

        console.log(randomQuestions);
        res.status(200).json(randomQuestions);
    } catch (error) {
        console.log("Error getting question from database: " + error);
        res.status(500).json({ error: 'Internal Server Error' });
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


