import { Router } from 'express';
import reservationRoutes from './reservationRoute';
import indexRoutes from './index.route';

const router = Router();

// Mount reservation routes
router.use('/reservation', reservationRoutes);

// Mount index routes
router.use('/', indexRoutes);

export default router;
