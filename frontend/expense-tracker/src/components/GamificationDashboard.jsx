import { useGamification } from '../context/GamificationContext';

const GamificationDashboard = () => {
  const { userStats, BADGES, getPointsForNextLevel, loading, refreshStats } = useGamification();
  
  const currentLevelPoints = (userStats.level - 1) * 100;
  const nextLevelPoints = getPointsForNextLevel(userStats.level);
  const progressToNextLevel = ((userStats.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  const getUserBadges = () => {
    return userStats.badges.map(badgeId => 
      Object.values(BADGES).find(badge => badge.id === badgeId)
    ).filter(Boolean);
  };

  const getAvailableBadges = () => {
    return Object.values(BADGES).filter(badge => 
      !userStats.badges.includes(badge.id)
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white flex items-center">
          🎮 Your Progress
        </h2>
        <button 
          onClick={refreshStats}
          className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading your stats...</span>
        </div>
      ) : (
        <>
          {/* Level and Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold">Level</h3>
              <p className="text-4xl font-bold">{userStats.level}</p>
            </div>
            
            <div className="text-center bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold">Total Points</h3>
              <p className="text-4xl font-bold">{userStats.points}</p>
            </div>
            
            <div className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold">Current Streak</h3>
              <p className="text-4xl font-bold">{userStats.streak} 🔥</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Level {userStats.level} Progress
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {userStats.points - currentLevelPoints} / {nextLevelPoints - currentLevelPoints} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {nextLevelPoints - userStats.points} points to Level {userStats.level + 1}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.totalExpenses}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{userStats.expensesThisMonth}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{getUserBadges().length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{userStats.streak}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
            </div>
          </div>

          {/* Earned Badges */}
          {getUserBadges().length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">🏆 Earned Badges</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getUserBadges().map((badge) => (
                  <div 
                    key={badge.id}
                    className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-700 p-4 rounded-lg text-center border-2 border-yellow-300 dark:border-yellow-600"
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm">{badge.name}</h4>
                    <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">{badge.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                      +{badge.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Badges */}
          {getAvailableBadges().length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 dark:text-white">🎯 Available Badges</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getAvailableBadges().slice(0, 4).map((badge) => (
                  <div 
                    key={badge.id}
                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center opacity-60 hover:opacity-80 transition-opacity"
                  >
                    <div className="text-3xl mb-2 grayscale">{badge.icon}</div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{badge.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-400 text-white text-xs rounded-full">
                      +{badge.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions for Points */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Earn More Points</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Add an expense: +5 points</li>
              <li>• Use AI Assistant: +5 points</li>
              <li>• Generate AI Insights: +15 points</li>
              <li>• Maintain daily streak: Bonus points</li>
              <li>• Unlock badges: Up to +150 points</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default GamificationDashboard;