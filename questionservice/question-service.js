const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 8003;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Importamos la función desde questionTemplates.js
const templates = require('./templates.json')
// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questiondb';
mongoose.connect(mongoUri);

const WikiQuery = require('./wikiUtils/wikiQuery');
const Question = require('./question-model');

function selectRandomTemplatesKeys(templateKeys, sampleSize) {
    const randomTemplateKeys = [];
    while (randomTemplateKeys.length < sampleSize) {
        const randomIndex = Math.floor(Math.random() * templateKeys.length);
        const randomKey = templateKeys[randomIndex];
        if (!randomTemplateKeys.includes(randomKey)) {
            randomTemplateKeys.push(randomKey);
        }
    }
    return randomTemplateKeys;
}

async function generateQuestions() {
    const templateKeys = Object.keys(templates);
    const randomTemplateKeys = selectRandomTemplatesKeys(templateKeys, 5);
    const randomTemplates = randomTemplateKeys.map(key => templates[key]);

    let newQuestions = [];
    for (let template of randomTemplates) {
        let wikiQuestions = await WikiQuery.getQuestions(template, 20)
        newQuestions.push(...wikiQuestions);   
    }
    await Question.insertMany(newQuestions);
}

async function extractAndRemoveRandomQuestions(sampleSize) {
    let randomQuestions = await Question.aggregate([
        { $sample: { size: sampleSize } }
    ]);
    await Question.deleteMany({ _id: { $in: randomQuestions.map(doc => doc._id) } });
    return randomQuestions;
}

function checkReq(reqBody) {
    // Verificar que el cuerpo de la solicitud contiene los campos necesarios
    const { question, answers, questionCategory } = reqBody;
    if (!question || !answers || !questionCategory) {
        return { error: 'Missing required fields' };
    }

    // Verificar que 'answers' sea un array y contenga al menos una respuesta
    if (!Array.isArray(answers) || answers.length === 0) {
        return { error: 'Invalid format for answers' };
    }

    // Verificar que cada respuesta tenga el formato correcto
    for (const answer of answers) {
        if (!answer.hasOwnProperty('answer') || !answer.hasOwnProperty('correct')) {
            return { error: 'Invalid format for answers' };
        }
    }

    return { error: null };
}

app.get('/getquestions', async (req, res) => {
    try {

        const sampleSize = 5
        let randomQuestions = await extractAndRemoveRandomQuestions(sampleSize);

        if (randomQuestions.length < sampleSize) {
            console.log("Not enough questions in database. Adding new ones...");
            await generateQuestions();
            randomQuestions = await extractAndRemoveRandomQuestions(sampleSize);
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
        const checkResponse = checkReq(req.body);
        if (checkResponse.error !== null) {
            return res.status(400).json(checkResponse);
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
        const checkResponse = checkReq(req.body);
        if (checkResponse.error !== null) {
            return res.status(400).json(checkResponse);
        }

        // Actualizar la pregunta en la base de datos con los datos proporcionados en el cuerpo de la solicitud
        const updatedQuestion = await Question.findByIdAndUpdate(id, {
            question: req.body.question,
            answers: req.body.answers,
            questionCategory: req.body.questionCategory
        }, { new: true });

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