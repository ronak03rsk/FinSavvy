import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import Assistant from "./pages/Assistant";
import AIInsights from "./components/AIInsights";
import Leaderboard from "./pages/Leaderboard";
import { GamificationProvider } from "./context/GamificationContext";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

function App() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <GamificationProvider>
      <Router>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          {/* Mobile overlay */}
          {isAuthenticated && sidebarOpen && (
            <div 
              className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Sidebar */}
          {isAuthenticated && (
            <div className={`
              fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile header */}
            {isAuthenticated && (
              <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            )}

            {/* Page content */}
            <div className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                {/* If already authenticated, redirect away from auth pages */}
                <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/assistant" element={isAuthenticated ? <Assistant /> : <Navigate to="/login" />} />
                <Route path="/insights" element={isAuthenticated ? <AIInsights /> : <Navigate to="/login" />} />
                <Route path="/leaderboard" element={isAuthenticated ? <Leaderboard /> : <Navigate to="/login" />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </GamificationProvider>
  );
}

export default App;
