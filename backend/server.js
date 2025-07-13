import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import gamificationRoutes from "./routes/gamificationRoutes.js";




dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("FinSavvy API is running"));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/gamification", gamificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
