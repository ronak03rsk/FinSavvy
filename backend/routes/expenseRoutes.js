import express from "express";
import { addExpense, getExpenses, deleteExpense} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getExpenses).post(protect, addExpense);
router.route("/:id").delete(protect, deleteExpense);

export default router;
