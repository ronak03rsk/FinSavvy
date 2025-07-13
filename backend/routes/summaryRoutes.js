import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCategorySummary, getMonthlySummary } from "../controllers/summaryController.js";

const router = express.Router();

router.get("/categories", protect, getCategorySummary);
router.get("/monthly", protect, getMonthlySummary);

export default router;
