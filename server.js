// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// DEBUG: Print the URI (remove this line after it works)
console.log('MongoDB URI:', process.env.MONGO_URI);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined in .env file');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  applications: [{
    jobTitle: String,
    company: String,
    status: { type: String, enum: ['pending','interviewed','offered','rejected'], default: 'pending' },
    date: { type: Date, default: Date.now }
  }]
});

const User = mongoose.model('User', userSchema);

// Auth middleware
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashed });
    await user.save();
    res.json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid password' });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
    res.json({ token, user: { name: user.name, email: user.email, applications: user.applications } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/applications', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.applications.push(req.body);
    await user.save();
    res.json(user.applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/applications/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const apps = user.applications;
    const stats = {
      total: apps.length,
      pending: apps.filter(a => a.status === 'pending').length,
      interviewed: apps.filter(a => a.status === 'interviewed').length,
      offered: apps.filter(a => a.status === 'offered').length,
      rejected: apps.filter(a => a.status === 'rejected').length
    };
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));