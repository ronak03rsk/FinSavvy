import express from "express";
import {
  getGamificationStats,
  updateGamificationStats,
  awardPoints,
  addExpenseStats,
  awardBadge,
  resetMonthlyStats
} from "../controllers/gamificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user's gamification stats
router.get("/stats", getGamificationStats);

// Update user's gamification stats
router.put("/stats", updateGamificationStats);

// Award points to user
router.post("/points", awardPoints);

// Update stats when expense is added
router.post("/expense", addExpenseStats);

// Award badge to user
router.post("/badge", awardBadge);

// Reset monthly stats (admin only - you can add admin middleware)
router.post("/reset-monthly", resetMonthlyStats);

export default router;
