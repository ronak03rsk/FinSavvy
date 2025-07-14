import { useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { useGamification } from "../context/GamificationContext";

const Assistant = () => {
  const { useAI } = useGamification();
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      content: "👋 Hi! I'm your FinSavvy AI Assistant. I can help you with budgeting, saving, debt management, investing, and credit improvement. What financial question can I help you with today?",
      category: "welcome"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input; // Store input before clearing
    setInput("");
    setLoading(true);

    try {
      // Fix: Get token directly from localStorage, not from user object
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      console.log("Making request to /api/ai/production with token:", token?.substring(0, 20) + "...");
      
      const res = await axiosInstance.post("/api/ai/production", { message: userInput });

      console.log("AI Response:", res.data);

      const botMessage = { 
        role: "assistant", 
        content: res.data.reply,
        category: res.data.category || "general",
        confidence: res.data.confidence || "medium",
        suggestions: res.data.suggestions || []
      };
      setMessages((prev) => [...prev, botMessage]);
      
      // Award gamification points for using AI
      await useAI('chat');
    } catch (err) {
      console.error("AI Assistant error:", err.response?.data || err.message);
      
      // Try debug endpoint as fallback (no auth required)
      try {
        console.log("Trying debug endpoint as fallback...");
        const debugRes = await axiosInstance.post("/api/ai/debug", { message: userInput });
        
        const botMessage = { 
          role: "assistant", 
          content: debugRes.data.reply + " (via debug mode)",
          category: debugRes.data.category || "general",
          confidence: debugRes.data.confidence || "medium",
          suggestions: debugRes.data.suggestions || []
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (debugErr) {
        console.error("Debug endpoint also failed:", debugErr);
        setMessages((prev) => [
          ...prev,
          { 
            role: "assistant", 
            content: `Error: ${err.response?.data?.msg || err.message || "Connection failed"}. Backend error: ${debugErr.response?.data?.msg || debugErr.message}`,
            category: "error"
          },
        ]);
      }
    }

    setLoading(false);
  };

  // Quick action buttons for common questions
  const quickQuestions = [
    "How do I create a budget?",
    "Help me save money",
    "How to pay off debt?",
    "Should I invest in 401k?",
    "How to improve credit score?"
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">🤖 FinSavvy AI Assistant</h2>
      
      {/* Quick Questions */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="h-96 overflow-y-auto border dark:border-gray-700 p-4 rounded bg-gray-50 dark:bg-gray-900">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div className={`inline-block max-w-xs lg:max-w-md xl:max-w-lg p-3 rounded-lg ${
              msg.role === "user" 
                ? "bg-blue-500 text-white rounded-br-none" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
            }`}>
              <p className="text-sm">{msg.content}</p>
              
              {/* Show category and confidence for AI responses */}
              {msg.role === "assistant" && msg.category && msg.category !== "welcome" && msg.category !== "error" && (
                <div className="mt-2 text-xs opacity-75">
                  <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 px-2 py-1 rounded">
                    {msg.category}
                  </span>
                  {msg.confidence && (
                    <span className="ml-1 text-gray-500">
                      • {msg.confidence} confidence
                    </span>
                  )}
                </div>
              )}
              
              {/* Show suggestions */}
              {msg.role === "assistant" && msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-2 text-xs">
                  <p className="font-semibold mb-1">Suggestions:</p>
                  {msg.suggestions.map((suggestion, idx) => (
                    <p key={idx} className="opacity-75">• {suggestion}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left mb-4">
            <div className="inline-block bg-gray-200 dark:bg-gray-700 p-3 rounded-lg rounded-bl-none">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex mt-4">
        <input
          type="text"
          className="flex-1 border p-3 rounded-l dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask about budgeting, saving, investing, debt, or credit..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-6 bg-blue-600 text-white rounded-r hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        💡 Pro tip: Be specific about your financial situation for better advice!
      </p>
    </div>
  );
};

export default Assistant;
