const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  resultId: { type: Number, required: true, unique: true },
  raceId: Number,
  driverId: Number,
  constructorId: Number,
  number: Number,
  grid: Number,
  position: Number,
  positionText: String,
  positionOrder: Number,
  points: Number,
  laps: Number,
  time: String,
  milliseconds: Number,
  fastestLap: Number,
  rank: Number,
  fastestLapTime: String,
  fastestLapSpeed: Number,
  statusId: Number
});

module.exports = mongoose.model('Result', ResultSchema);