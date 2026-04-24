const mongoose = require('mongoose');

const SeasonSchema = new mongoose.Schema({
  year: { type: Number, required: true, unique: true },
  url: String
});

module.exports = mongoose.model('Season', SeasonSchema);