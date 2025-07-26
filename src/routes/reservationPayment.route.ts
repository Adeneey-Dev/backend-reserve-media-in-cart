import express from 'express';
import { initiatePayment, paystackWebhook } from '../controllers/reservationPayment.controller';

const router = express.Router();

router.post('/payment/initiate', initiatePayment);

// IMPORTANT: Paystack sends as JSON
router.post('/payment/webhook', express.json({ type: 'application/json' }), paystackWebhook);

export default router;
