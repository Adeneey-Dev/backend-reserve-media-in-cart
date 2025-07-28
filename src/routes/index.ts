import { Router } from 'express';
import indexRoutes from './index.route';
import reservationRoutes from './reservation.route';
import reservationPaymentRoutes from './reservationPayment.route';

const router = Router();

// Mount reservation routes
router.use('/reservations', reservationRoutes);

//Mount reservationPayment routes
router.use('/reservationPayments', reservationPaymentRoutes);

// Mount index routes
router.use('/', indexRoutes);

export default router;
