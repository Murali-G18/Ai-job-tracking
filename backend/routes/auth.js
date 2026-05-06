const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  await user.save();
  res.json({ message: 'User created' });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: 'User not found' });
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid password' });
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
  res.json({ token, user: { name: user.name, email: user.email, applications: user.applications } });
});

module.exports = router;