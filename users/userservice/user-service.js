// user-service.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const User = require('./user-model')

const app = express();
const port = 8001;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/historydb';
mongoose.connect(mongoUri);



// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
}

app.post('/adduser', async (req, res) => {
    try {
        // Check if required fields are present in the request body
        validateRequiredFields(req, ['username', 'password']);

        // Check if the user already exists
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Encrypt the password before saving it
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
        });

        await newUser.save();
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
});

app.get('/user', async (req, res) => {
  try {
    const users = await User.find({}, 'username createdAt');
    res.status(200).json(users);
  } catch (error) {
    console.log("Error getting users from database: " + error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

app.patch('/user/:id', async (req, res) => {
  try {
      const { id } = req.params;
      validateRequiredFields(req, ['username']);

      const updatedUser = await User.findByIdAndUpdate(id, {
          username: req.body.username
      }, { new: true });

      if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(updatedUser);
  } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ error: 'Error updating the question' });
  }
});

app.delete('/user/:id', async (req, res) => {
  try {
      const { id } = req.params;
      // Verificar si la pregunta existe en la base de datos
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      // Eliminar la pregunta de la base de datos
      await User.findByIdAndDelete(id);
      res.status(200).json({ status: 'OK' });
  } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: 'Error deleting the question' });
  }
});

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

// Listen for the 'close' event on the Express.js server
server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server