import { Router } from 'express';
import { reserveMedia, confirmPayment } from '../controllers/reservationController';

const router = Router();

router.post('/reserve', reserveMedia);
router.post('/confirm-payment', confirmPayment);

export default router;
