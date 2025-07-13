import User from "../models/User.js";

// Get user's gamification stats
export const getGamificationStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('gamification');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: user.gamification
    });
  } catch (error) {
    console.error("Error fetching gamification stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Update user's gamification stats
export const updateGamificationStats = async (req, res) => {
  try {
    const { stats } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update gamification stats
    user.gamification = { ...user.gamification, ...stats };
    await user.save();

    res.json({
      success: true,
      data: user.gamification,
      message: "Stats updated successfully"
    });
  } catch (error) {
    console.error("Error updating gamification stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Award points to user
export const awardPoints = async (req, res) => {
  try {
    const { points, action } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Award points
    user.gamification.points += points;
    
    // Recalculate level
    const newLevel = Math.floor(user.gamification.points / 100) + 1;
    const leveledUp = newLevel > user.gamification.level;
    user.gamification.level = newLevel;

    await user.save();

    res.json({
      success: true,
      data: user.gamification,
      leveledUp,
      message: `Awarded ${points} points for ${action}`
    });
  } catch (error) {
    console.error("Error awarding points:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Add expense and update stats
export const addExpenseStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

    res.json({
      success: true,
      data: user.gamification,
      message: "Expense stats updated"
    });
  } catch (error) {
    console.error("Error updating expense stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Award badge to user
export const awardBadge = async (req, res) => {
  try {
    const { badgeId, points } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has this badge
    if (user.gamification.badges.includes(badgeId)) {
      return res.json({
        success: true,
        data: user.gamification,
        message: "Badge already awarded"
      });
    }

    // Award badge and points
    user.gamification.badges.push(badgeId);
    user.gamification.points += points;
    
    // Recalculate level
    user.gamification.level = Math.floor(user.gamification.points / 100) + 1;

    await user.save();

    res.json({
      success: true,
      data: user.gamification,
      newBadge: true,
      message: `Badge ${badgeId} awarded with ${points} points`
    });
  } catch (error) {
    console.error("Error awarding badge:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Reset monthly stats (can be called via cron job or manually)
export const resetMonthlyStats = async (req, res) => {
  try {
    await User.updateMany(
      {},
      { $set: { "gamification.expensesThisMonth": 0 } }
    );

    res.json({
      success: true,
      message: "Monthly stats reset for all users"
    });
  } catch (error) {
    console.error("Error resetting monthly stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};
