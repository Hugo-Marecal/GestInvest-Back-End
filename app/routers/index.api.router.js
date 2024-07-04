import express from 'express';
import authRouter from './authRouter.js';
import dashboardRouter from './dashboardRouter.js';
import isAuth from '../middlewares/auth.middleware.js';
import accountRouter from './accountRouter.js';

// Create an instance of Express Router
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the API router!');
});

// Main API routes
router.use('/api/auth', authRouter);
router.use('/api/dashboard', isAuth.authMiddleware, dashboardRouter);
router.use('/api/account', isAuth.authMiddleware, accountRouter);

export default router;
