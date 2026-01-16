import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import * as userAuth from '../middleware/userAuth.js';

const router = express.Router();

// Process payment for an order
router.post('/process', userAuth.userAuth, paymentController.processPayment);

// Get payment status
router.get('/:orderId', userAuth.userAuth, paymentController.getPaymentStatus);

export default router;
