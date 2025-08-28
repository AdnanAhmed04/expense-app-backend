// src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { notFound, errorHandler } from "./middleware/error.js";
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transactions.routes.js";
import statsRoutes from "./routes/stats.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check (test route)
app.get("/", (req, res) => {
  res.json({ message: "🚀 API is running" });
});

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/stats", statsRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
