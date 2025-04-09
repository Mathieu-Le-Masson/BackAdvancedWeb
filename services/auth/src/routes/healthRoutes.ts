import { Router } from 'express';
import { getHealthStatus } from '../controllers/healthController';
import { getAllServicesHealth } from '../controllers/systemHealthController';

const router = Router();

router.get('/', getHealthStatus);
router.get('/all', getAllServicesHealth); // Nouvel endpoint

export default router;