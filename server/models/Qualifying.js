const mongoose = require('mongoose');

const QualifyingSchema = new mongoose.Schema({
  qualifyId: { type: Number, required: true, unique: true },
  raceId: Number,
  driverId: Number,
  constructorId: Number,
  number: Number,
  position: Number,
  q1: String,
  q2: String,
  q3: String
});

module.exports = mongoose.model('Qualifying', QualifyingSchema);