import express from 'express';
import controllerWrapper from '../middlewares/controller.wrapper.middleware.js';
import accountController from '../controllers/accountController.js';

// Create an instance of Express Router
const router = express.Router();

// Account routes
router.get('/', controllerWrapper(accountController.getUser));
router.post('/', controllerWrapper(accountController.updateUser));

export default router;
