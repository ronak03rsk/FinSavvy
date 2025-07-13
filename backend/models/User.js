import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gamification: {
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    totalExpenses: { type: Number, default: 0 },
    expensesThisMonth: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastExpenseDate: { type: Date, default: null },
    badges: [{ type: String }],
    achievements: [{ type: String }]
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
