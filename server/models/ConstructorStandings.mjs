import mongoose from 'mongoose';

const ConstructorStandingSchema = new mongoose.Schema({
  constructorStandingsId: { type: Number, required: true, unique: true },
  raceId: Number,
  constructorId: Number,
  points: Number,
  position: Number,
  positionText: String,
  wins: Number
});

export default mongoose.models.Result || mongoose.model('Result', ConstructorStandingSchema);