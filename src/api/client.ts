import axios from "axios";
import config from "@/config";
import { setupLogger } from "@/middleware/logger";
import { handleApiError } from "@/middleware/error";

export const client = axios.create({
  baseURL: config.api.baseURL,
  headers: {
    "Content-Type": "application/json",
    "Admin-Version": config.api.adminVersion,
  },
});

// Setup logging middleware
setupLogger(client);

// Add request interceptor
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(handleApiError(error));
  }
); 