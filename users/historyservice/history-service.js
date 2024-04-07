// history-service.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const History = require('./history-model')

const app = express();
const port = 8004;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);


app.post('/savehistory', async (req, res) => {
    try {
        let username = req.body.username; //necesitamos el username

        //Extraer los datos de la solicitud
        const { NumPreguntasJugadas, NumAcertadas } = req.body;
    
        // Buscar si ya existe una entrada en la base de datos con el mismo nombre de usuario
        let historyEntry = await History.findOne({ username: username });

        if (historyEntry !== null) {
          // Si la entrada ya existe, actualizamos los datos
          historyEntry.NumJugadas = historyEntry.NumJugadas + 1;
          historyEntry.NumPreguntasJugadas = historyEntry.NumPreguntasJugadas + NumPreguntasJugadas;
          historyEntry.NumAcertadas = historyEntry.NumAcertadas + NumAcertadas;
          historyEntry.NumFalladas = historyEntry.NumFalladas + NumPreguntasJugadas - NumAcertadas;
        } else {
          // Si la entrada no existe, creamos una nueva
          historyEntry = new History({
            username: username,
            NumJugadas: 1,
            NumPreguntasJugadas: NumPreguntasJugadas,
            NumAcertadas: NumAcertadas,
            NumFalladas: NumPreguntasJugadas - NumAcertadas
          })
        }
    
        // Guardar la entrada en la base de datos
        await historyEntry.save();
        
        // Respuesta exitosa
        res.json(historyEntry);
      } catch (error) {
        // Manejo de errores
        res.status(400).json({ error: 'Error al guardar el historial' });
      }
});

app.get('/gethistory', async (req, res) => {
  try {
    
      let username = req.query.username;

      // Buscar el historial en la base de datos basado en el nombre de usuario
      let historyEntry = await History.findOne({ username: username });

      if (historyEntry === null) {
        
        // Si no se encuentra ningún historial para el usuario, crear un nuevo historial con valores igualados a 0
        historyEntry = new History({
          username: username,
          NumJugadas: 0,
          NumPreguntasJugadas: 0,
          NumAcertadas: 0,
          NumFalladas: 0
        })

        // Guardar el nuevo historial en la base de datos
        await historyEntry.save();

      }

      res.json(historyEntry);

  } catch (error) {
      res.status(500).json({ error: 'Error al obtener el historial' });
  }
});

app.get('/gethistory/:username', async (req, res) => {
  try {
      let username = req.params.username;


      // Buscar el historial en la base de datos basado en el nombre de usuario
      let historyEntry = await History.findOne({ username:username });

      if (historyEntry === null) {
        res.status(404).json({ error: 'No se encontro historial para este usuario'});
      } else {
        res.json(historyEntry);
      }
     

  } catch (error) {
      res.status(500).json({ error: 'Error al obtener el historial' });
  }
});

const server = app.listen(port, () => {
  console.log(`History Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server