const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.post('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.applications.push(req.body);
  await user.save();
  res.json(user.applications);
});

router.get('/stats', auth, async (req, res) => {
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
});

module.exports = router;