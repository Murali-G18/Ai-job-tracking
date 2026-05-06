const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobTitle: String,
  company: String,
  status: { type: String, enum: ['pending','interviewed','offered','rejected'], default: 'pending' },
  date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  applications: [applicationSchema]
});

module.exports = mongoose.model('User', userSchema);