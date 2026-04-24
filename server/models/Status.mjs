import mongoose from 'mongoose';

const StatusSchema = new mongoose.Schema({
  statusId: { type: Number, required: true, unique: true },
  status: String
});

module.exports = mongoose.model('Status', StatusSchema);