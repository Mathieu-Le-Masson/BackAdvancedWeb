import express, { Request, Response, NextFunction } from 'express';
import * as mapController from '../controllers/mapController';

const router = express.Router();

const asyncHandler = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

router.post('/geocode', asyncHandler((req, res) => mapController.geocode(req, res)));
router.post('/route', asyncHandler((req, res) => mapController.route(req, res)));
router.post('/delivery-zone', asyncHandler((req, res) => mapController.checkDeliveryZone(req, res)));

export default router;