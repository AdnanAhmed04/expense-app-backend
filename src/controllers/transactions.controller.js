import { z } from 'zod';
import Transaction from '../models/Transaction.js';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.union([z.string(), z.date()]),
  note: z.union([z.string().max(280), z.literal('')]).optional(),
});

export const createTransaction = async (req, res) => {
  const parsed = transactionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid data', errors: parsed.error.flatten().fieldErrors });
  const data = parsed.data;
  const doc = await Transaction.create({
    user: req.user.id,
    type: data.type,
    amount: data.amount,
    category: data.category,
    date: new Date(data.date),
    note: data.note || undefined,
  });
  res.status(201).json({ transaction: doc });
};

export const getTransactions = async (req, res) => {
  const { page = 1, limit = 20, type, category, start, end, sort = '-date' } = req.query;
  const q = { user: req.user.id };
  if (type) q.type = type;
  if (category) q.category = category;
  if (start || end) {
    q.date = {};
    if (start) q.date.$gte = new Date(start);
    if (end) q.date.$lte = new Date(end);
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Transaction.find(q).sort(sort).skip(skip).limit(Number(limit)),
    Transaction.countDocuments(q),
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

export const getTransaction = async (req, res) => {
  const doc = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json({ transaction: doc });
};

export const updateTransaction = async (req, res) => {
  const updates = {};
  if (req.body.type) updates.type = req.body.type;
  if (req.body.amount != null) updates.amount = req.body.amount;
  if (req.body.category) updates.category = req.body.category;
  if (req.body.date) updates.date = new Date(req.body.date);
  if ('note' in req.body) updates.note = req.body.note;
  const doc = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: updates },
    { new: true }
  );
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json({ transaction: doc });
};

export const deleteTransaction = async (req, res) => {
  const doc = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!doc) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
};
