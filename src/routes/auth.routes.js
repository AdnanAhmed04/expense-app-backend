import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { register, login, me } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// ✅ Use /register not /signup
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', auth, asyncHandler(me));

export default router;
