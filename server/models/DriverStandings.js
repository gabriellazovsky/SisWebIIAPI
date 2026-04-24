const mongoose = require('mongoose');

const DriverStandingSchema = new mongoose.Schema({
  driverStandingsId: { type: Number, required: true, unique: true },
  raceId: Number,
  driverId: Number,
  points: Number,
  position: Number,
  positionText: String,
  wins: Number
});

module.exports = mongoose.model('DriverStanding', DriverStandingSchema);