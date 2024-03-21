const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
});

const History = mongoose.model('History', historySchema);

module.exports = History