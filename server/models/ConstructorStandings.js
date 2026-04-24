const mongoose = require('mongoose');

const ConstructorStandingSchema = new mongoose.Schema({
  constructorStandingsId: { type: Number, required: true, unique: true },
  raceId: Number,
  constructorId: Number,
  points: Number,
  position: Number,
  positionText: String,
  wins: Number
});

module.exports = mongoose.model('ConstructorStanding', ConstructorStandingSchema);