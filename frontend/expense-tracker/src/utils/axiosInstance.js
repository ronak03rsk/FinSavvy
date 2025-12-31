import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Use environment variable for base URL
});

// Add JWT token from sessionStorage to every request
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 responses globally: clear token; route guards will handle navigation
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      try {
        sessionStorage.removeItem("token");
      } catch {}
    }
    return Promise.reject(error);
  }
);

export default API;
