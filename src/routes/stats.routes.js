// src/routes/stats.routes.js
import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { summary, byCategory, byMonth } from "../controllers/stats.controller.js";

const router = Router();

// ✅ Apply auth middleware to all routes
router.use(auth);

// ✅ Default info route
router.get("/", (req, res) => {
  res.json({
    message: "📊 Stats API is working",
    availableEndpoints: [
      "/api/stats/summary",
      "/api/stats/by-category",
      "/api/stats/by-month",
    ],
  });
});

// ✅ Business routes
router.get("/summary", asyncHandler(summary));
router.get("/by-category", asyncHandler(byCategory));
router.get("/by-month", asyncHandler(byMonth));

export default router;
