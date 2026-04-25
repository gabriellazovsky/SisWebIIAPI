import mongoose from 'mongoose';

const SprintResultSchema = new mongoose.Schema({
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
  fastestLapTime: String,
  statusId: Number
});

module.exports = mongoose.model('SprintResult', SprintResultSchema);