import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use environment variable for base URL
});

// Add JWT token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
