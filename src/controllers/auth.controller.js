import { z } from 'zod';
import User from '../models/User.js';
import { signToken } from '../middleware/auth.js';

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const register = async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid data',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { name, email, password } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password });
  const token = signToken(user);

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
};

export const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid data',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select('_id name email createdAt');
  res.json({ user });
};
