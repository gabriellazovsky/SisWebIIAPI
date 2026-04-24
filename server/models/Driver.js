const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  driverId: { type: Number, required: true, unique: true },
  driverRef: String,
  number: Number,
  code: String,
  forename: String,
  surname: String,
  dob: Date,
  nationality: String,
  url: String
});

module.exports = mongoose.model('Driver', DriverSchema);