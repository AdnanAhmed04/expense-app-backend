import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createTransaction, getTransactions, getTransaction, updateTransaction, deleteTransaction } from '../controllers/transactions.controller.js';

const router = Router();

router.use(auth);

router.get('/', asyncHandler(getTransactions));
router.post('/', asyncHandler(createTransaction));
router.get('/:id', asyncHandler(getTransaction));
router.patch('/:id', asyncHandler(updateTransaction));
router.delete('/:id', asyncHandler(deleteTransaction));

export default router;
