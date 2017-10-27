'use strict';

const express = require('express');
const authRoutes = require('./auth.route');

const router = express.Router();

/** GET /status-server - Check service health */
router.get('/status-server', (req, res) =>
  res.send('OK')
);

// mount auth routes at /auth
router.use('/auth', authRoutes);

module.exports = router;
