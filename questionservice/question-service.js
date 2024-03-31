const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8003;

// Importamos la función desde questionTemplates.js
const templates = require('./templates.json')
// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questiondb';
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
        res.status(200).json({ status: 'OK' });
    } catch (error) {
        res.status(error.response.status).json({ error: error.response.data.error });
    }

});

app.post('/createquestion', async (req, res) => {
    try {
        // Verificar que el cuerpo de la solicitud contiene los campos necesarios
        const { question, answers, questionCategory } = req.body;
        if (!question || !answers || !questionCategory) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verificar que 'answers' sea un array y contenga al menos una respuesta
        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ error: 'Invalid format for answers' });
        }

        // Verificar que cada respuesta tenga el formato correcto
        for (const answer of answers) {
            if (!answer.hasOwnProperty('answer') || !answer.hasOwnProperty('correct')) {
                return res.status(400).json({ error: 'Invalid format for answers' });
            }
        }

        // Crear una nueva pregunta basada en el cuerpo de la solicitud
        const newQuestion = new Question(req.body);
        // Guardar la nueva pregunta en la base de datos
        await newQuestion.save();
        
        // Devolver la nueva pregunta creada, incluido el ID asignado por la base de datos
        res.status(201).json(newQuestion);
    } catch (error) {
        console.log("Error creating question: " + error);
        res.status(500).json({ error: 'Error creating the question' });
    }
})

// Ruta para actualizar una pregunta por ID
app.put('/updatequestion/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar que el cuerpo de la solicitud contiene los campos necesarios
        const { question, answers, questionCategory } = req.body;
        if (!question || !answers || !questionCategory) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verificar que 'answers' sea un array y contenga al menos una respuesta
        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ error: 'Invalid format for answers' });
        }

        // Verificar que cada respuesta tenga el formato correcto
        for (const answer of answers) {
            if (!answer.hasOwnProperty('answer') || !answer.hasOwnProperty('correct')) {
                return res.status(400).json({ error: 'Invalid format for answers' });
            }
        }

        // Actualizar la pregunta en la base de datos
        const updatedQuestion = await Question.findByIdAndUpdate(id, { question, answers, questionCategory }, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error("Error updating question:", error);
        res.status(500).json({ error: 'Error updating the question' });
    }
});

// Ruta para eliminar una pregunta por ID
app.delete('/deletequestion/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Verificar si la pregunta existe en la base de datos
        const question = await Question.findById(id);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        // Eliminar la pregunta de la base de datos
        await Question.findByIdAndDelete(id);
        res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ error: 'Error deleting the question' });
    }
});

const server = app.listen(port, () => {
    console.log(`Question Service listening on http://localhost:${port}`);
});

server.on('close', () => {
    mongoose.connection.close();
  });

module.exports = server