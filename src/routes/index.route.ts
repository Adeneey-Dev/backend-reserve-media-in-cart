import { Router } from 'express';
/* CONTROLLER IMPORT */
import { home } from '../controllers/index.controller';

const router = Router();

router.get('/', home);

export default router;
