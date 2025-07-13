import express from "express";
import { askAssistant, testAssistant, simpleAssistant, askAssistant2, openaiAssistant, enhancedAssistant, productionAssistant, getAIInsights } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Test endpoint without authentication for debugging
router.post("/debug", productionAssistant);

// Multiple AI options
router.post("/ask", protect, askAssistant); // Original HF (GPT-2)
router.post("/ask2", protect, askAssistant2); // Alternative HF (DistilGPT-2)
router.post("/openai", protect, openaiAssistant); // OpenAI (requires API key)
router.post("/enhanced", protect, enhancedAssistant); // Enhanced local AI
router.post("/production", protect, productionAssistant); // Production-ready local AI
router.post("/test", protect, testAssistant); // Random responses
router.post("/simple", protect, simpleAssistant); // Basic rule-based

// AI Insights for expense analysis
router.get("/insights", protect, getAIInsights); // Expense analysis with AI insights

export default router;