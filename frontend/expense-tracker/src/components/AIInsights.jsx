import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { useGamification } from "../context/GamificationContext";

const AIInsights = () => {
  const { useAI } = useGamification();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState("");
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    if (!income || income <= 0) {
      setError("Please enter a valid monthly income");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const token = sessionStorage.getItem("token");
      
      if (!token) {
        setError("Please login to view insights");
        return;
      }

      const response = await axiosInstance.get(`/api/ai/insights?income=${income}`);

      setInsights(response.data);
      
      // Award gamification points for using AI insights
      await useAI('insights');
    } catch (err) {
      console.error("AI Insights error:", err);
      setError(err.response?.data?.msg || "Failed to fetch insights");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">🧠 AI Financial Insights</h2>
      
      {/* Income Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Monthly Income (₹)
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your monthly income"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={fetchInsights}
            disabled={loading || !income}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Analyzing..." : "Get Insights"}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Analyzing your financial data...</span>
          </div>
        </div>
      )}

      {/* Insights Display */}
      {insights && (
        <div className="space-y-6">
          {/* Main Analysis */}
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
              📊 Financial Analysis
            </h3>
            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">
              {insights.reply}
            </div>
          </div>

          {/* Metrics Cards */}
          {insights.metrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200">Savings Rate</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {insights.metrics.savingsRate}%
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">Total Expenses</h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(insights.metrics.totalExpenses)}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200">Health Score</h4>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {insights.metrics.healthScore}/100
                </p>
              </div>
            </div>
          )}

          {/* Alerts */}
          {insights.alerts && insights.alerts.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                ⚠️ Important Alerts
              </h4>
              <ul className="space-y-2">
                {insights.alerts.map((alert, index) => (
                  <li key={index} className="text-yellow-700 dark:text-yellow-300">
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {insights.recommendations && insights.recommendations.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                💡 Recommendations
              </h4>
              <ul className="space-y-2">
                {insights.recommendations.map((rec, index) => (
                  <li key={index} className="text-blue-700 dark:text-blue-300">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Expense Breakdown */}
          {insights.expenseBreakdown && (
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                📈 Expense Breakdown
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(insights.expenseBreakdown).map(([category, amount]) => (
                  <div key={category} className="text-center p-3 bg-white dark:bg-gray-800 rounded">
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {category}
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {formatCurrency(amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Info */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Analysis based on {insights.totalTrackedExpenses} expense entries from the last month
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          💡 How it works
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your monthly income and get personalized AI-powered insights based on your expense patterns from the last month. 
          The AI analyzes your spending habits, calculates your savings rate, and provides actionable recommendations to improve your financial health.
        </p>
      </div>
    </div>
  );
};

export default AIInsights;
