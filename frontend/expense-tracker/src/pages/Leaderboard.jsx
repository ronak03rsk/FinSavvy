import { useGamification } from '../context/GamificationContext';

const Leaderboard = () => {
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

  const milestones = [
    { level: 1, points: 0, title: "Beginner Tracker", icon: "🌱" },
    { level: 5, points: 400, title: "Expense Explorer", icon: "🗺️" },
    { level: 10, points: 900, title: "Budget Warrior", icon: "⚔️" },
    { level: 15, points: 1400, title: "Finance Master", icon: "👑" },
    { level: 20, points: 1900, title: "Money Guru", icon: "🧙‍♂️" },
  ];

  const getNextMilestone = () => {
    return milestones.find(milestone => userStats.level < milestone.level) || milestones[milestones.length - 1];
  };

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold dark:text-white flex items-center">
          🏆 Progress & Achievements
        </h2>
        <button 
          onClick={refreshStats}
          className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-lg text-gray-600 dark:text-gray-400">Loading your achievements...</span>
        </div>
      ) : (
        <>
          {/* Hero Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Current Status */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8 rounded-2xl shadow-2xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Your Current Status</h3>
                <div className="text-6xl font-bold mb-2">{userStats.level}</div>
                <p className="text-xl opacity-90 mb-4">Level {userStats.level}</p>
                <div className="bg-white/20 rounded-full p-4 inline-block">
                  <span className="text-2xl">
                    {milestones.find(m => m.level <= userStats.level)?.icon || "🌱"}
                  </span>
                </div>
                <p className="mt-2 opacity-75">
                  {milestones.find(m => m.level <= userStats.level)?.title || "Beginner"}
                </p>
              </div>
            </div>

            {/* Next Goal */}
            <div className="bg-gradient-to-br from-green-600 to-teal-600 text-white p-8 rounded-2xl shadow-2xl">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Next Milestone</h3>
                <div className="text-6xl font-bold mb-2">{getNextMilestone().level}</div>
                <p className="text-xl opacity-90 mb-4">Level {getNextMilestone().level}</p>
                <div className="bg-white/20 rounded-full p-4 inline-block">
                  <span className="text-2xl">{getNextMilestone().icon}</span>
                </div>
                <p className="mt-2 opacity-75">{getNextMilestone().title}</p>
                <p className="mt-4 text-sm opacity-90">
                  {getNextMilestone().points - userStats.points} points to go!
                </p>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 dark:text-white">📈 Level Progress</h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Level {userStats.level} → Level {userStats.level + 1}
              </span>
              <span className="text-lg text-gray-500 dark:text-gray-400 font-bold">
                {userStats.points - currentLevelPoints} / {nextLevelPoints - currentLevelPoints} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-6 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${Math.min(progressToNextLevel, 100)}%` }}
              ></div>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-3 font-medium">
              🎯 {nextLevelPoints - userStats.points} points until level up!
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl text-center shadow-lg">
              <div className="text-3xl mb-2">💰</div>
              <p className="text-3xl font-bold">{userStats.points}</p>
              <p className="text-blue-100">Total Points</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl text-center shadow-lg">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-3xl font-bold">{userStats.totalExpenses}</p>
              <p className="text-green-100">Total Expenses</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-xl text-center shadow-lg">
              <div className="text-3xl mb-2">🔥</div>
              <p className="text-3xl font-bold">{userStats.streak}</p>
              <p className="text-orange-100">Day Streak</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-xl text-center shadow-lg">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-3xl font-bold">{getUserBadges().length}</p>
              <p className="text-purple-100">Badges Earned</p>
            </div>
          </div>

          {/* Badges Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Earned Badges */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 dark:text-white flex items-center">
                🏆 Earned Badges
                <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded-full">
                  {getUserBadges().length}
                </span>
              </h3>
              {getUserBadges().length > 0 ? (
                <div className="space-y-4">
                  {getUserBadges().map((badge) => (
                    <div 
                      key={badge.id}
                      className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-800 dark:to-yellow-700 rounded-xl border-l-4 border-yellow-500"
                    >
                      <div className="text-4xl mr-4">{badge.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-yellow-800 dark:text-yellow-200">{badge.name}</h4>
                        <p className="text-sm text-yellow-600 dark:text-yellow-300">{badge.description}</p>
                      </div>
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        +{badge.points}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🎯</div>
                  <p>No badges earned yet!</p>
                  <p className="text-sm">Start tracking expenses to earn your first badge.</p>
                </div>
              )}
            </div>

            {/* Available Badges */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 dark:text-white flex items-center">
                🎯 Available Badges
                <span className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded-full">
                  {getAvailableBadges().length}
                </span>
              </h3>
              <div className="space-y-4">
                {getAvailableBadges().slice(0, 6).map((badge) => (
                  <div 
                    key={badge.id}
                    className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <div className="text-4xl mr-4 grayscale">{badge.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-700 dark:text-gray-300">{badge.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{badge.description}</p>
                    </div>
                    <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm">
                      +{badge.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">🚀 Earn More Points</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">📝</div>
                <h4 className="font-bold mb-2">Track Expenses</h4>
                <p className="text-indigo-100 text-sm mb-2">Add daily expenses to earn points and maintain your streak</p>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">+5 points each</span>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🤖</div>
                <h4 className="font-bold mb-2">Use AI Assistant</h4>
                <p className="text-indigo-100 text-sm mb-2">Get financial advice and earn points</p>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">+5 points</span>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🧠</div>
                <h4 className="font-bold mb-2">Generate Insights</h4>
                <p className="text-indigo-100 text-sm mb-2">Analyze your spending patterns</p>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">+15 points</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
