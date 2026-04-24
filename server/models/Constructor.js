const mongoose = require('mongoose');

const ConstructorSchema = new mongoose.Schema({
  constructorId: { type: Number, required: true, unique: true },
  constructorRef: String,
  name: String,
  nationality: String,
  url: String
});

module.exports = mongoose.model('Constructor', ConstructorSchema);