import express from 'express';
import controllerWrapper from '../middlewares/controller.wrapper.middleware.js';
import dashBoardController from '../controllers/dashboardController.js';

// Create an instance of Express Router
const router = express.Router();

// Dashboard routes
router.get('/', controllerWrapper(dashBoardController.dashboardDetail));
router.get('/modal', controllerWrapper(dashBoardController.openModal));
router.post('/buy', controllerWrapper(dashBoardController.addLine));
router.post('/sell', controllerWrapper(dashBoardController.addLine));

// Asset details route
router.get('/assetdetails/:asset', controllerWrapper(dashBoardController.assetDetails));

export default router;
