import express from 'express';
import controllerWrapper from '../middlewares/controller.wrapper.middleware.js';
import authController from '../controllers/authController.js';

// Create an instance of Express Router
const router = express.Router();

// Auth routes
router.post('/signup', controllerWrapper(authController.signup));
router.post('/login', controllerWrapper(authController.login));
router.get('/verify/:token', controllerWrapper(authController.verifyEmail));

export default router;
