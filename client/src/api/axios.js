import axios from "axios";

// * Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5000/api", // ? Update this with your server URL
  headers: {
    "Content-Type": "application/json",
  },
});

// * Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // ? Get token from localStorage
    const token = localStorage.getItem("token");

    // * If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// * Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ! Handle 401 Unauthorized errors (expired/invalid token)
    if (error.response?.status === 401) {
      localStorage.clear(); // * Clear all stored data
      window.location.href = "/"; // * Redirect to login
    }

    return Promise.reject(error);
  }
);

export default api;
