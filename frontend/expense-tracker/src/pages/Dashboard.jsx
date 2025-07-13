import { useEffect, useState } from "react";
import API from "../utils/axiosInstance";
import { useGamification } from "../context/GamificationContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f97316", "#ec4899", "#22d3ee"];

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "" });
  const { addExpense, loading: gamificationLoading } = useGamification();

  // Fetch expenses on load
  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses", err.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add new expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/expenses", {
        ...form,
        amount: parseFloat(form.amount),
      });
      setExpenses([...expenses, res.data]);
      
      // Award gamification points (backend handles this now)
      await addExpense(parseFloat(form.amount));
      
      setForm({ title: "", amount: "", category: "" });
      
      // Show success message with points
      console.log("🎉 Expense added! +5 points earned!");
    } catch (err) {
      alert("Failed to add expense");
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      alert("Failed to delete expense");
    }
  };


  const [categorySummary, setCategorySummary] = useState({});
  const [monthlySummary, setMonthlySummary] = useState({});

  useEffect(() => {
    API.get("/summary/categories").then(res => setCategorySummary(res.data));
  }, []);

  const handleFetchMonthly = async () => {
    const income = prompt("Enter your monthly income:");
    if (!income) return;
    const res = await API.get(`/summary/monthly?income=${income}`);
    setMonthlySummary(res.data);
  };

  // Total amount
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Group by category
  const groupedByCategory = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const chartData = Object.entries(groupedByCategory).map(([cat, amt]) => ({
    name: cat,
    value: amt,
  }));

  // Line chart by date
  const lineData = expenses.map((exp) => ({
    date: new Date(exp.date).toLocaleDateString(),
    amount: exp.amount,
  }));

  return (
    <div className="p-4 sm:p-6 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 dark:text-white">📊 Dashboard</h2>

      {/* Add Expense Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">➕ Add New Expense</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button className="bg-blue-600 text-white hover:bg-blue-700 transition rounded-md px-4 py-2 font-medium sm:col-span-1 col-span-1">
          Add Expense
        </button>
        </form>
      </div>

      {/* Charts and Expense List */}

      {/* Summary */}
      <div className="mb-6 text-lg font-semibold text-green-600 dark:text-green-400">
        Total Spent: ₹{totalSpending.toFixed(2)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow">
          <h3 className="text-lg font-medium mb-2 dark:text-white">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded mb-6 shadow">
          <h3 className="text-lg font-medium mb-2 dark:text-white">📌 Budget Analyzer (By Category)</h3>
          {Object.entries(categorySummary).map(([cat, amt]) => (
            <div key={cat} className="flex justify-between py-1">
              <span className="dark:text-gray-300">{cat}</span><span className="dark:text-gray-300">₹{amt.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded mb-6 shadow">
          <h3 className="text-lg font-medium mb-2 dark:text-white">🧾 Monthly Summary</h3>
          <button onClick={handleFetchMonthly} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded mb-3 transition">Enter Income & View Summary</button>
          {monthlySummary.income && (
            <ul className="space-y-1">
              <li className="dark:text-gray-300">Total Income: ₹{monthlySummary.income}</li>
              <li className="dark:text-gray-300">Total Spent: ₹{monthlySummary.totalExpense.toFixed(2)}</li>
              <li className="dark:text-gray-300">Savings: ₹{monthlySummary.savings.toFixed(2)}</li>
              <li className="dark:text-gray-300">Savings Rate: {monthlySummary.savingsRate}%</li>
              <li className="dark:text-gray-300">Health Score: <strong>{monthlySummary.score}</strong></li>
            </ul>
          )}
        </div>


        <div className="bg-white dark:bg-gray-800 rounded p-4 shadow">
          <h3 className="text-lg font-medium mb-2 dark:text-white">Spending Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense List */}
      <div>
        <h3 className="text-lg font-medium mb-2 dark:text-white">Recent Expenses</h3>
        <div className="space-y-2">
          {expenses.length === 0 ? (
            <p className="dark:text-gray-400">No expenses yet.</p>
          ) : (
            expenses.map((exp) => (
              <div
                key={exp._id}
                className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <strong className="dark:text-white">{exp.title}</strong><span className="dark:text-gray-300"> • {exp.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-700 dark:text-blue-300 font-semibold">₹{exp.amount}</span>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
