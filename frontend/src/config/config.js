// API Configuration
// Base URL cho backend API
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// API endpoints
export const API_ENDPOINTS = {
  PRODUCTS: {
    LIST: "/api/product/list",
    SINGLE: (id) => `/api/product/${id}`,
  },
  USER: {
    LOGIN: "/api/user/login",
    REGISTER: "/api/user/register",
  },
};
