import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { summary, byCategory, byMonth } from '../controllers/stats.controller.js';

const router = Router();

router.use(auth);

router.get('/summary', asyncHandler(summary));
router.get('/by-category', asyncHandler(byCategory));
router.get('/by-month', asyncHandler(byMonth));

export default router;
