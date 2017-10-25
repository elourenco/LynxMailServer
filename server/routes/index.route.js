import express from 'express';
import authRoutes from './auth.route';

const router = express.Router();

/** GET /status-server - Check service health */
router.get('/status-server', (req, res) =>
  res.send('OK')
);

// mount auth routes at /auth
router.use('/auth', authRoutes);

export default router;
