const mongoose = require('mongoose');

const LapTimeSchema = new mongoose.Schema({
  raceId: Number,
  driverId: Number,
  lap: Number,
  position: Number,
  time: String,
  milliseconds: Number
});

LapTimeSchema.index({ raceId: 1, driverId: 1, lap: 1 }, { unique: true });

module.exports = mongoose.model('LapTime', LapTimeSchema);