const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    NumJugadas: {
      type: String,
      required: true,
    },
    NumPreguntasJugadas: {
        type: String,
        required: true,
    },
    NumAcertadas: {
        type: String,
        required: true,
    },
    NumFalladas: {
        type: String,
        required: true,
    }
});

const History = mongoose.model('History', historySchema);

module.exports = History