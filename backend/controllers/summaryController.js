import Expense from "../models/Expense.js";
import User from "../models/User.js";

// GET /api/summary/categories
export const getCategorySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ userId });

    const summary = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    res.json(summary);
  } catch (err) {
    console.error("Category Summary Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET /api/summary/monthly
export const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { income = 0 } = req.query;

    const start = new Date(); start.setDate(1); start.setHours(0,0,0,0);
    const end = new Date();

    const expenses = await Expense.find({ userId, date: { $gte: start, $lte: end } });
    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const savings = income - totalExpense;
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(2) : null;
    const score = savingsRate >= 20 ? "Great" :
                  savingsRate >= 10 ? "Good" : "Needs Improvement";

    res.json({ income, totalExpense, savings, savingsRate, score });
  } catch (err) {
    console.error("Monthly Summary Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
