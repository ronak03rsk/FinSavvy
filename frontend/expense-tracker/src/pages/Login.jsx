// // src/pages/Login.jsx
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useState } from "react";

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Here you’ll call backend login API. For now, we fake it:
//     login(); // Set auth state
//     navigate("/dashboard");
//   };

//   return (
//     <div className="flex items-center justify-center h-full">
//       <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">Login to FinSavvy</h2>
//         <input
//           className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
//           type="password"
//           placeholder="Password"
//         />
//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
//         >
//           Login
//         </button>
//         <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
//           Don't have an account? <a href="/register" className="text-blue-500">Register</a>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  const res = await API.post("/api/auth/login", form);
  sessionStorage.setItem("token", res.data.token);
      login();
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">💰 Login to FinSavvy</h2>
        <input 
          name="email" 
          placeholder="Email" 
          type="email"
          onChange={handleChange} 
          className="w-full mb-4 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
          required 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          onChange={handleChange} 
          className="w-full mb-6 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
          required 
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition">Login</button>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
          Don't have an account? <a href="/register" className="text-blue-500 hover:text-blue-600">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
