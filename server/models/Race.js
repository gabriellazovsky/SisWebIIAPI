const mongoose = require('mongoose');

const RaceSchema = new mongoose.Schema({
  raceId: { type: Number, required: true, unique: true },
  year: Number,
  round: Number,
  circuitId: Number, 
  name: String,
  date: Date,
  time: String,
  url: String
});

module.exports = mongoose.model('Race', RaceSchema);