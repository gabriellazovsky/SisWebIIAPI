const mongoose = require('mongoose');

const PitStopSchema = new mongoose.Schema({
  raceId: { type: Number, required: true },
  driverId: { type: Number, required: true },
  stop: { type: Number, required: true }, 
  lap: Number,
  time: String,         
  duration: String,     
  milliseconds: Number
});

PitStopSchema.index(
  { raceId: 1, driverId: 1, stop: 1 },
  { unique: true }
);

module.exports = mongoose.model('PitStop', PitStopSchema);