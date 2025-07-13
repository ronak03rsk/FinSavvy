import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const GamificationContext = createContext();

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const [userStats, setUserStats] = useState({
    points: 0,
    level: 1,
    totalExpenses: 0,
    expensesThisMonth: 0,
    streak: 0,
    lastExpenseDate: null,
    badges: [],
    achievements: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's gamification stats from backend
  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/gamification/stats');
      if (response.data.success) {
        setUserStats(response.data.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching gamification stats:', err);
      setError(err.response?.data?.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  // Load user stats on component mount
  useEffect(() => {
    fetchUserStats();
  }, []);

  // Badge definitions
  const BADGES = {
    FIRST_EXPENSE: {
      id: 'first_expense',
      name: 'First Step',
      description: 'Added your first expense',
      icon: '👶',
      points: 10
    },
    EXPENSE_TRACKER: {
      id: 'expense_tracker',
      name: 'Expense Tracker',
      description: 'Added 10 expenses',
      icon: '📝',
      points: 50
    },
    BUDGET_MASTER: {
      id: 'budget_master',
      name: 'Budget Master',
      description: 'Added 50 expenses',
      icon: '💰',
      points: 100
    },
    STREAK_MASTER: {
      id: 'streak_master',
      name: 'Streak Master',
      description: '7-day expense tracking streak',
      icon: '🔥',
      points: 75
    },
    AI_ENTHUSIAST: {
      id: 'ai_enthusiast',
      name: 'AI Enthusiast',
      description: 'Used AI assistant 10 times',
      icon: '🤖',
      points: 60
    },
    INSIGHTS_SEEKER: {
      id: 'insights_seeker',
      name: 'Insights Seeker',
      description: 'Generated AI insights',
      icon: '🧠',
      points: 40
    },
    SAVER: {
      id: 'saver',
      name: 'Smart Saver',
      description: 'Maintained 20%+ savings rate',
      icon: '💎',
      points: 150
    }
  };

  // Calculate level based on points
  const calculateLevel = (points) => {
    return Math.floor(points / 100) + 1;
  };

  // Calculate points needed for next level
  const getPointsForNextLevel = (currentLevel) => {
    return currentLevel * 100;
  };

  // Award points (this will be handled by backend now)
  const awardPoints = async (points, action) => {
    try {
      const response = await axiosInstance.post('/gamification/points', {
        points,
        action
      });
      
      if (response.data.success) {
        setUserStats(response.data.data);
        
        // Show level up notification
        if (response.data.leveledUp) {
          showNotification(`🎉 Level Up! Welcome to Level ${response.data.data.level}!`, 'success');
        }
      }
    } catch (err) {
      console.error('Error awarding points:', err);
    }
  };

  // Check for new badges
  const checkForNewBadges = async (action) => {
    const newBadges = [];

    // Check each badge condition
    if (action === 'expense_added' && userStats.totalExpenses === 1 && !userStats.badges.includes(BADGES.FIRST_EXPENSE.id)) {
      newBadges.push(BADGES.FIRST_EXPENSE);
    }

    if (userStats.totalExpenses >= 10 && !userStats.badges.includes('expense_tracker')) {
      newBadges.push(BADGES.EXPENSE_TRACKER);
    }

    if (userStats.totalExpenses >= 50 && !userStats.badges.includes('budget_master')) {
      newBadges.push(BADGES.BUDGET_MASTER);
    }

    if (userStats.streak >= 7 && !userStats.badges.includes('streak_master')) {
      newBadges.push(BADGES.STREAK_MASTER);
    }

    if (action === 'ai_insights' && !userStats.badges.includes('insights_seeker')) {
      newBadges.push(BADGES.INSIGHTS_SEEKER);
    }

    // Award new badges
    for (const badge of newBadges) {
      try {
        const response = await axiosInstance.post('/gamification/badge', {
          badgeId: badge.id,
          points: badge.points
        });
        
        if (response.data.success && response.data.newBadge) {
          setUserStats(response.data.data);
          showNotification(`🏆 New Badge: ${badge.name}! +${badge.points} points`, 'badge');
        }
      } catch (err) {
        console.error('Error awarding badge:', err);
      }
    }
  };

  // Update expense stats (this will be handled by expense controller)
  const addExpense = async (amount) => {
    // Refresh stats from server since backend handles the update
    await fetchUserStats();
    
    // Check for badges
    await checkForNewBadges('expense_added');
  };

  // AI interaction tracking
  const useAI = async (type) => {
    // Refresh stats since backend handles the update
    await fetchUserStats();
    
    // Check for badges
    await checkForNewBadges(type === 'insights' ? 'ai_insights' : 'ai_chat');
  };

  // Show notification (you can integrate with a toast library)
  const showNotification = (message, type) => {
    // For now, just console.log - you can integrate with react-hot-toast or similar
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // You could also create a simple toast notification here
    if (window.showGamificationToast) {
      window.showGamificationToast(message, type);
    }
  };

  // Refresh stats manually
  const refreshStats = () => {
    fetchUserStats();
  };

  const value = {
    userStats,
    loading,
    error,
    BADGES,
    awardPoints,
    addExpense,
    useAI,
    calculateLevel,
    getPointsForNextLevel,
    checkForNewBadges,
    refreshStats
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
