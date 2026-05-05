import express from 'express';
import { userMiddleware } from '../middleware/userMiddleware.js';
import { createCheckoutSession } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout', userMiddleware, createCheckoutSession);

import { confirmCheckout } from '../controllers/paymentController.js';
router.post('/confirm', userMiddleware, confirmCheckout);

export default router;
