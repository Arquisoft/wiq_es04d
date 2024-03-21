const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    NumJugadas: {
      type: Number,
      required: true,
    },
    NumPreguntasJugadas: {
        type: Number,
        required: true,
    },
    NumAcertadas: {
        type: Number,
        required: true,
    },
    NumFalladas: {
        type: Number,
        required: true,
    }
});

const History = mongoose.model('History', historySchema);

module.exports = History