// API Configuration
// Base URL cho backend API
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// API endpoints
export const API_ENDPOINTS = {
  CART: {
    ADD: "/api/cart/add",
    CLEAR: "/api/cart/clear",
    GET: "/api/cart/get",
    SYNC: "/api/cart/sync",
    UPDATE: "/api/cart/update",
  },
  ORDER: {
    DETAIL: (id) => `/api/order/${id}/status`,
    PLACE: "/api/order/place",
    USER_ORDERS: "/api/order/user",
  },
  PRODUCTS: {
    LIST: "/api/product/list",
    SINGLE: (id) => `/api/product/${id}`,
  },
  USER: {
    LOGIN: "/api/user/login",
    LOGOUT: "/api/user/logout",
    PROFILE: "/api/user/profile",
    REGISTER: "/api/user/register",
  },
};
