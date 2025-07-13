// // src/pages/Register.jsx
// import React from "react";

// const Register = () => {
//   return (
//     <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
//       <h2 className="text-xl font-bold mb-4">Register</h2>
//       <form className="flex flex-col gap-4">
//         <input type="text" placeholder="Name" className="border p-2 rounded" />
//         <input type="email" placeholder="Email" className="border p-2 rounded" />
//         <input type="password" placeholder="Password" className="border p-2 rounded" />
//         <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Register</button>
//       </form>
//     </div>
//   );
// };

// export default Register;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      login();
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">💰 Join FinSavvy</h2>
        <input 
          name="name" 
          placeholder="Full Name" 
          onChange={handleChange} 
          className="w-full mb-4 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
          required 
        />
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
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition">Create Account</button>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
          Already have an account? <a href="/login" className="text-blue-500 hover:text-blue-600">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
