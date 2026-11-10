import axios from "axios";

// Dynamically use the current host so it works seamlessly on localhost, 127.0.0.1, or LAN (192.168.1.8)
const host =
  typeof window !== "undefined" && window.location.hostname
    ? window.location.hostname
    : "localhost";

const API = axios.create({
  baseURL: `http://${host}:5000/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject JWT token from localStorage into Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthenticated 401s
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
      }
    }
    return Promise.reject(error);
  }
);

export default API;
