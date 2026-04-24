import mongoose from 'mongoose';

const CircuitSchema = new mongoose.Schema({
  circuitId: { type: Number, required: true, unique: true },
  circuitRef: String,
  name: String,
  location: String,
  country: String,
  lat: Number,
  lng: Number,
  alt: Number,
  url: String
});

module.exports = mongoose.model('Circuit', CircuitSchema);