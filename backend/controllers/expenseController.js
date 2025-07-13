import Expense from "../models/Expense.js";
import User from "../models/User.js";

export const addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, userId: req.user.id });
    
    // Update user's gamification stats
    const user = await User.findById(req.user.id);
    if (user) {
      const today = new Date();
      const todayString = today.toDateString();
      const lastExpenseDate = user.gamification.lastExpenseDate;
      
      // Calculate streak
      let newStreak = 1;
      if (lastExpenseDate) {
        const lastDateString = new Date(lastExpenseDate).toDateString();
        const timeDiff = today.getTime() - new Date(lastExpenseDate).getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff === 1) {
          newStreak = user.gamification.streak + 1;
        } else if (daysDiff === 0) {
          newStreak = user.gamification.streak; // Same day
        }
      }

      // Update stats
      user.gamification.totalExpenses += 1;
      user.gamification.expensesThisMonth += 1;
      user.gamification.streak = newStreak;
      user.gamification.lastExpenseDate = today;
      user.gamification.points += 5; // Award 5 points for adding expense

      // Recalculate level
      user.gamification.level = Math.floor(user.gamification.points / 100) + 1;

      await user.save();
    }
    
    res.status(201).json(expense);
  } catch (err) {
    console.error("Add expense error:", err);
    res.status(500).json({ msg: "Failed to add expense" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch expenses" });
  }
};


// DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    // Check ownership
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await expense.deleteOne();
    res.status(200).json({ msg: "Deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

