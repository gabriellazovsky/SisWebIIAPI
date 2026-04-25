import mongoose from 'mongoose';

const ConstructorResultSchema = new mongoose.Schema({
  constructorResultsId: { type: Number, required: true, unique: true },
  raceId: Number,
  constructorId: Number,
  points: Number,
  status: String
});

module.exports = mongoose.model('ConstructorResult', ConstructorResultSchema);