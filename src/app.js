import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import transactionRoutes from './routes/transactions.routes.js';
import statsRoutes from './routes/stats.routes.js';
import { notFound, errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();

// Allowed origins
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin) return cb(null, true); // for Postman/cURL
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS'));
    },
    credentials: false,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Expense API' });
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/stats', statsRoutes);

// ✅ Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
