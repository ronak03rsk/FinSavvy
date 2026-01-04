// import axios from "axios";

// export const askAssistant = async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ msg: "Message is required" });
//   }

//   try {
//     const hfRes = await axios.post(
//       "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
//       {
//         inputs: `User: ${message}\nAssistant:`,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const textResponse = hfRes.data[0]?.generated_text?.split("Assistant:")[1]?.trim();
//     res.status(200).json({ reply: textResponse || "Sorry, I couldn't understand that." });

//   } catch (err) {
//     console.error("Hugging Face API error:", err.message);
//     res.status(500).json({ msg: "Hugging Face error", error: err.message });
//   }
// };


import axios from "axios";
import Expense from "../models/Expense.js";
import User from "../models/User.js";

export const askAssistant = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ msg: "Message is required" });
  }

  try {
    // First, let's check if the API key is available
    if (!process.env.HF_API_KEY) {
      return res.status(500).json({ msg: "Hugging Face API key not configured" });
    }

    console.log("🔍 Making request to Hugging Face API...");
    
    const hfRes = await axios.post(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        inputs: `Q: ${message}\nA:`,
        parameters: {
          max_length: 100,
          temperature: 0.7,
          return_full_text: false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log("✅ Hugging Face response:", hfRes.data);
    
    // Update gamification stats for AI usage
    try {
      const user = await User.findById(req.user.id);
      if (user) {
        user.gamification.points += 5; // Award 5 points for AI chat
        user.gamification.level = Math.floor(user.gamification.points / 100) + 1;
        await user.save();
      }
    } catch (gamificationError) {
      console.error("Gamification update error:", gamificationError);
      // Don't fail the main request if gamification update fails
    }
    
    const responseText = hfRes.data[0]?.generated_text;
    res.status(200).json({ reply: responseText || "No clear response generated." });
  } catch (err) {
    console.error("❌ Hugging Face API error:", err.response?.data || err.message);
    
    // More detailed error response
    if (err.response?.status === 404) {
      res.status(500).json({ 
        msg: "Hugging Face model not found", 
        error: "The specified model endpoint does not exist or is not available",
        details: err.response?.data || err.message
      });
    } else if (err.response?.status === 401) {
      res.status(500).json({ 
        msg: "Hugging Face authentication error", 
        error: "Invalid or missing API key" 
      });
    } else {
      res.status(500).json({ 
        msg: "Hugging Face error", 
        error: err.response?.data || err.message 
      });
    }
  }
};

// Simple test endpoint without external API
export const testAssistant = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ msg: "Message is required" });
  }

  // Simple predefined responses for testing
  const responses = [
    "Here's a great tip: Track your expenses daily to identify spending patterns.",
    "Consider creating a budget with the 50/30/20 rule - 50% needs, 30% wants, 20% savings.",
    "Try the envelope method for budgeting your monthly expenses.",
    "Set up automatic transfers to your savings account to build wealth consistently.",
    "Review your subscriptions monthly and cancel unused services."
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  res.status(200).json({ 
    reply: `Regarding "${message}": ${randomResponse}`,
    source: "test-mode"
  });
};

// Alternative assistant using a simple rule-based approach
export const simpleAssistant = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ msg: "Message is required" });
  }

  const lowerMessage = message.toLowerCase();
  let response = "";

  // Simple keyword-based responses
  if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
    response = "Here are some saving tips: Set up automatic transfers to savings, use the 50/30/20 budgeting rule, and track your expenses daily.";
  } else if (lowerMessage.includes("budget") || lowerMessage.includes("budgeting")) {
    response = "For budgeting: Try the envelope method, use budgeting apps, and review your spending monthly to identify areas to cut back.";
  } else if (lowerMessage.includes("debt") || lowerMessage.includes("loan")) {
    response = "For debt management: Pay minimums on all debts, then focus extra payments on highest interest debt first (avalanche method).";
  } else if (lowerMessage.includes("invest") || lowerMessage.includes("investment")) {
    response = "Investment basics: Start with an emergency fund, consider low-cost index funds, and diversify your portfolio based on your risk tolerance.";
  } else if (lowerMessage.includes("expense") || lowerMessage.includes("spending")) {
    response = "Track your expenses using apps, categorize spending, and identify unnecessary subscriptions or impulse purchases to reduce.";
  } else {
    response = "I can help with budgeting, saving, debt management, investments, and expense tracking. What specific financial topic would you like advice on?";
  }

  res.status(200).json({ 
    reply: response,
    source: "rule-based-assistant"
  });
};

// Alternative HF models to try
export const askAssistant2 = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ msg: "Message is required" });
  }

  try {
    if (!process.env.HF_API_KEY) {
      return res.status(500).json({ msg: "Hugging Face API key not configured" });
    }

    console.log("🔍 Trying alternative HF model...");
    
    // Try text-generation endpoint
    const hfRes = await axios.post(
      "https://api-inference.huggingface.co/models/distilgpt2",
      {
        inputs: `Financial advice: ${message}. Answer:`,
        parameters: {
          max_length: 100,
          temperature: 0.8,
          do_sample: true
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("✅ Alternative HF response:", hfRes.data);
    
    const responseText = hfRes.data[0]?.generated_text;
    res.status(200).json({ reply: responseText || "No response generated." });
  } catch (err) {
    console.error("❌ Alternative HF error:", err.response?.data || err.message);
    res.status(500).json({ 
      msg: "Alternative Hugging Face error", 
      error: err.response?.data || err.message 
    });
  }
};

// OpenAI-compatible endpoint (for if you get OpenAI API key)
export const openaiAssistant = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ msg: "Message is required" });
  }

  try {
    // This would work if you have OpenAI API key
    const openaiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful financial advisor. Provide practical, actionable advice for personal finance, budgeting, saving, and investing."
          },
          {
            role: "user", 
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = openaiRes.data.choices[0].message.content;
    res.status(200).json({ reply, source: "openai" });
  } catch (err) {
    console.error("❌ OpenAI error:", err.response?.data || err.message);
    res.status(500).json({ 
      msg: "OpenAI error", 
      error: err.response?.data || err.message 
    });
  }
};

// Local AI simulation (enhanced rule-based)
export const enhancedAssistant = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ msg: "Message is required" });
  }

  const lowerMessage = message.toLowerCase();
  let response = "";

  // More sophisticated keyword matching
  if (lowerMessage.includes("emergency") && lowerMessage.includes("fund")) {
    response = "Build an emergency fund with 3-6 months of expenses. Start with $1000, then save 10% of income monthly until you reach your target.";
  } else if (lowerMessage.includes("credit") && lowerMessage.includes("score")) {
    response = "Improve credit score by: paying bills on time, keeping credit utilization below 30%, don't close old accounts, and check your credit report annually.";
  } else if (lowerMessage.includes("save") || lowerMessage.includes("saving")) {
    const tips = [
      "Set up automatic transfers to savings (pay yourself first principle)",
      "Use the 52-week challenge: save week number in dollars each week",
      "Cut one subscription and redirect that money to savings",
      "Use cashback apps and redirect earnings to savings account"
    ];
    response = tips[Math.floor(Math.random() * tips.length)];
  } else if (lowerMessage.includes("budget") || lowerMessage.includes("budgeting")) {
    const budgetTips = [
      "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings/debt",
      "Use the envelope method: allocate cash for each spending category",
      "Track expenses for a month to identify spending patterns",
      "Start with zero-based budgeting: assign every dollar a purpose"
    ];
    response = budgetTips[Math.floor(Math.random() * budgetTips.length)];
  } else if (lowerMessage.includes("debt")) {
    response = "Choose debt payoff strategy: Snowball method (smallest balance first) for motivation, or Avalanche method (highest interest first) for math optimization.";
  } else if (lowerMessage.includes("invest")) {
    response = "Investment basics: Start with index funds, diversify across asset classes, invest regularly (dollar-cost averaging), and think long-term (10+ years).";
  } else if (lowerMessage.includes("retirement") || lowerMessage.includes("401k")) {
    response = "Maximize employer 401k match (free money!), then contribute to Roth IRA, then max out 401k. Start early - compound interest is powerful!";
  } else {
    const general = [
      "Focus on increasing income, reducing expenses, and investing the difference.",
      "Track your net worth monthly to see progress over time.",
      "Automate your finances: bills, savings, and investments.",
      "Read 'The Total Money Makeover' or 'The Simple Path to Wealth' for foundational knowledge."
    ];
    response = general[Math.floor(Math.random() * general.length)];
  }

  res.status(200).json({ 
    reply: response,
    source: "enhanced-local-ai",
    confidence: "high"
  });
};

// Production-ready local AI with financial knowledge base
export const productionAssistant = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ msg: "Message is required" });
  }

  const lowerMessage = message.toLowerCase();
  let response = "";
  let category = "general";

  // Check if this is an expense analysis request
  const isExpenseAnalysis = lowerMessage.includes("monthly income") && lowerMessage.includes("spent the following");

  if (isExpenseAnalysis) {
    // Handle expense analysis
    const insights = generateExpenseInsights(message);
    return res.status(200).json({
      reply: insights.analysis,
      category: "expense-analysis",
      source: "production-local-ai",
      confidence: "high",
      recommendations: insights.recommendations,
      alerts: insights.alerts
    });
  }

  // Regular chat functionality
  const financialKnowledge = {
    budgeting: {
      keywords: ["budget", "budgeting", "monthly", "plan", "allocate", "spending plan"],
      responses: [
        "Start with the 50/30/20 rule: 50% for needs (rent, utilities, groceries), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment.",
        "Try zero-based budgeting: Give every dollar a job before the month begins. Income minus expenses should equal zero.",
        "Use the envelope method: Allocate cash for each spending category and stick to it.",
        "Track your expenses for 30 days first to see where your money actually goes, then create realistic budget categories."
      ]
    },
    saving: {
      keywords: ["save", "saving", "savings", "emergency fund", "rainy day"],
      responses: [
        "Build an emergency fund first: Start with $1,000, then work toward 3-6 months of expenses.",
        "Automate your savings: Set up automatic transfers on payday so you 'pay yourself first'.",
        "Use the 52-week challenge: Save the dollar amount equal to the week number (Week 1 = $1, Week 52 = $52).",
        "Open a high-yield savings account to earn more interest on your emergency fund."
      ]
    },
    debt: {
      keywords: ["debt", "loan", "credit card", "payoff", "owe"],
      responses: [
        "Choose your debt strategy: Snowball (smallest balance first) for motivation, or Avalanche (highest interest first) for math optimization.",
        "Pay minimums on all debts, then put extra money toward one debt using your chosen strategy.",
        "Consider debt consolidation if you have good credit and can get a lower interest rate.",
        "Stop using credit cards while paying off debt to avoid digging a deeper hole."
      ]
    },
    investing: {
      keywords: ["invest", "investing", "investment", "stocks", "401k", "ira", "retirement"],
      responses: [
        "Start with your employer's 401(k) match - it's free money! Contribute at least enough to get the full match.",
        "Open a Roth IRA and contribute up to the annual limit ($6,500 for 2024, $7,500 if 50+).",
        "Consider low-cost index funds like VTSAX or FZROX for broad market exposure.",
        "Invest regularly using dollar-cost averaging to reduce the impact of market volatility."
      ]
    },
    creditScore: {
      keywords: ["credit", "score", "credit report", "credit history"],
      responses: [
        "Pay all bills on time - payment history is 35% of your credit score.",
        "Keep credit utilization below 30% (ideally below 10%) of your available credit limits.",
        "Don't close old credit cards - length of credit history matters.",
        "Check your credit report annually at annualcreditreport.com for errors."
      ]
    },
    income: {
      keywords: ["income", "salary", "raise", "side hustle", "earn more"],
      responses: [
        "Ask for a raise: Research market rates and document your achievements before the conversation.",
        "Develop marketable skills: Take online courses, get certifications, or learn new technologies.",
        "Start a side hustle: Freelancing, tutoring, or selling products can supplement your income.",
        "Consider a career change to a higher-paying field if you've maximized your current role."
      ]
    }
  };

  // Find matching category
  for (const [cat, data] of Object.entries(financialKnowledge)) {
    if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
      category = cat;
      response = data.responses[Math.floor(Math.random() * data.responses.length)];
      break;
    }
  }

  // Fallback responses for unmatched queries
  if (!response) {
    const fallbackResponses = [
      "I specialize in budgeting, saving, debt management, investing, and credit improvement. What specific financial goal can I help you with?",
      "Personal finance is about spending less than you earn and investing the difference. What area would you like to focus on?",
      "The key to financial success is consistency. Whether it's budgeting, saving, or investing - small actions compound over time.",
      "Financial wellness has four pillars: budgeting, saving, debt management, and investing. Which pillar needs your attention?"
    ];
    response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  // Award gamification points for AI chat usage (5 points)
  try {
    if (req.user?.id) {
      const user = await User.findById(req.user.id);
      if (user) {
        if (!user.gamification) {
          user.gamification = {
            points: 0,
            level: 1,
            totalExpenses: 0,
            expensesThisMonth: 0,
            streak: 0,
            lastExpenseDate: null,
            badges: [],
            achievements: []
          };
        }
        user.gamification.points += 5;
        user.gamification.level = Math.floor(user.gamification.points / 100) + 1;
        await user.save();
      }
    }
  } catch (gamificationError) {
    console.error("Gamification update error:", gamificationError);
    // Don't fail the main request if gamification update fails
  }

  res.status(200).json({ 
    reply: response,
    category: category,
    source: "production-local-ai",
    confidence: "high",
    suggestions: category !== "general" ? [
      "Would you like more specific advice about this topic?",
      "Do you have questions about implementing this strategy?",
      "Would you like to know about related financial concepts?"
    ] : [
      "Try asking about: budgeting, saving, debt payoff, investing, or credit scores",
      "Be specific about your financial situation for better advice",
      "I can help with both beginner and advanced financial strategies"
    ]
  });
};

// Helper function to generate expense insights
const generateExpenseInsights = (expensePrompt) => {
  const lines = expensePrompt.split('\n');
  const incomeLine = lines.find(line => line.includes('monthly income'));
  const expenseLines = lines.filter(line => line.includes('₹') && line.includes('on'));

  // Extract income
  const incomeMatch = incomeLine?.match(/₹([\d,]+)/);
  const income = incomeMatch ? parseInt(incomeMatch[1].replace(/,/g, '')) : 0;

  // Extract expenses
  const expenses = {};
  let totalExpenses = 0;

  expenseLines.forEach(line => {
    const match = line.match(/₹([\d,.]+)\s+on\s+(.+)/);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      const category = match[2].trim();
      expenses[category] = amount;
      totalExpenses += amount;
    }
  });

  // Generate insights
  const savingsRate = ((income - totalExpenses) / income) * 100;
  const recommendations = [];
  const alerts = [];
  
  // Analyze spending patterns
  const sortedExpenses = Object.entries(expenses)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  let analysis = `📊 **Monthly Financial Analysis**\n\n`;
  analysis += `💰 **Income**: ₹${income.toLocaleString()}\n`;
  analysis += `💸 **Total Expenses**: ₹${totalExpenses.toLocaleString()}\n`;
  analysis += `💡 **Savings**: ₹${(income - totalExpenses).toLocaleString()} (${savingsRate.toFixed(1)}%)\n\n`;

  analysis += `🔍 **Top Spending Categories:**\n`;
  sortedExpenses.forEach(([category, amount], index) => {
    const percentage = ((amount / totalExpenses) * 100).toFixed(1);
    analysis += `${index + 1}. ${category}: ₹${amount.toLocaleString()} (${percentage}%)\n`;
  });

  // Generate recommendations based on spending patterns
  if (savingsRate < 10) {
    alerts.push("⚠️ Low savings rate! Aim for at least 20% of income.");
    recommendations.push("Try to reduce discretionary spending and increase your savings rate to 20%.");
  } else if (savingsRate > 30) {
    recommendations.push("🎉 Excellent savings rate! Consider investing the surplus for long-term growth.");
  }

  // Category-specific recommendations
  if (expenses['food'] > income * 0.15) {
    recommendations.push("🍽️ Food expenses seem high. Try meal planning and cooking at home more often.");
  }
  
  if (expenses['entertainment'] > income * 0.1) {
    recommendations.push("🎬 Entertainment spending is above recommended 10%. Look for free or low-cost activities.");
  }

  if (expenses['transport'] > income * 0.15) {
    recommendations.push("🚗 Transportation costs are high. Consider carpooling, public transport, or remote work options.");
  }

  // Check for essential vs non-essential balance
  const essentialCategories = ['food', 'housing', 'utilities', 'transport', 'healthcare'];
  const essentialSpending = Object.entries(expenses)
    .filter(([category]) => essentialCategories.some(essential => 
      category.toLowerCase().includes(essential)))
    .reduce((sum, [, amount]) => sum + amount, 0);

  const essentialPercentage = (essentialSpending / income) * 100;
  
  if (essentialPercentage > 60) {
    alerts.push("⚠️ Essential expenses exceed 60% of income. Review necessity of each expense.");
  }

  analysis += `\n📈 **Financial Health Score**: ${calculateHealthScore(savingsRate, essentialPercentage)}/100\n`;

  return {
    analysis,
    recommendations,
    alerts,
    metrics: {
      savingsRate: savingsRate.toFixed(1),
      totalExpenses,
      income,
      healthScore: calculateHealthScore(savingsRate, essentialPercentage)
    }
  };
};

// Calculate financial health score
const calculateHealthScore = (savingsRate, essentialPercentage) => {
  let score = 50; // Base score
  
  // Savings rate scoring
  if (savingsRate >= 20) score += 30;
  else if (savingsRate >= 10) score += 20;
  else if (savingsRate >= 5) score += 10;
  
  // Essential spending scoring
  if (essentialPercentage <= 50) score += 20;
  else if (essentialPercentage <= 60) score += 10;
  else score -= 10;
  
  return Math.max(0, Math.min(100, score));
};

// AI Insights endpoint for expense analysis
export const getAIInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const { income } = req.query;

    if (!income || income <= 0) {
      return res.status(400).json({ msg: "Valid monthly income is required" });
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const expenses = await Expense.find({ userId, date: { $gte: oneMonthAgo } });

    if (expenses.length === 0) {
      return res.status(200).json({
        reply: "No expenses found for the last month. Start tracking your expenses to get personalized AI insights!",
        category: "no-data",
        recommendations: [
          "Add your daily expenses to get detailed financial analysis",
          "Track expenses in categories like food, transport, entertainment, etc.",
          "Come back after a week of expense tracking for insights"
        ]
      });
    }

    const summary = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    // Create a prompt for the AI analysis
    let prompt = `User has ₹${income} monthly income and spent the following last month:\n`;
    for (const [cat, amt] of Object.entries(summary)) {
      prompt += `- ₹${amt.toFixed(2)} on ${cat}\n`;
    }
    prompt += `\nWhat financial insights and improvements can you suggest?`;

    // Use the local AI to generate insights
    const insights = generateExpenseInsights(prompt);
    
    // Update gamification stats for AI insights usage
    try {
      const user = await User.findById(req.user.id);
      if (user) {
          if (!user.gamification) {
            user.gamification = {
              points: 0,
              level: 1,
              totalExpenses: 0,
              expensesThisMonth: 0,
              streak: 0,
              lastExpenseDate: null,
              badges: [],
              achievements: []
            };
          }
        user.gamification.points += 15; // Award 15 points for AI insights
        user.gamification.level = Math.floor(user.gamification.points / 100) + 1;
        await user.save();
      }
    } catch (gamificationError) {
      console.error("Gamification update error:", gamificationError);
      // Don't fail the main request if gamification update fails
    }
    
    res.status(200).json({
      reply: insights.analysis,
      category: "expense-analysis",
      source: "production-local-ai",
      confidence: "high",
      recommendations: insights.recommendations,
      alerts: insights.alerts,
      metrics: insights.metrics,
      expenseBreakdown: summary,
      totalTrackedExpenses: expenses.length
    });

  } catch (err) {
    console.error("❌ AI Insight generation failed:", err.message);
    res.status(500).json({ 
      msg: "AI insight generation failed", 
      error: err.message,
      fallback: "Try manually reviewing your expenses and aim for a 20% savings rate."
    });
  }
};

