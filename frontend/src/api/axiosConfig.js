import axios from "axios";
import { API_BASE_URL } from "../config/config.js";

/**
 * Cấu hình Axios instance cho toàn bộ ứng dụng
 * Tự động đính kèm token xác thực vào header của mỗi request
 */

// Tạo instance của axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor cho request để đính kèm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // Nếu có token, đính kèm vào header Authorization theo format Bearer
    if (token) {
      // Sử dụng config.headers.Authorization hoặc config.headers.set tùy theo phiên bản axios
      if (config.headers.set) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    // Xử lý lỗi request
    return Promise.reject(error);
  },
);

// Thêm interceptor cho response để xử lý các lỗi chung (ví dụ: 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Nếu nhận lỗi 401 (Hết hạn token hoặc không hợp lệ)
    if (error.response && error.response.status === 401) {
      // Chỉ xóa token nếu request không phải là request để clear cart
      // (vì sau khi đặt hàng thành công, clear cart có thể được gọi và không cần token)
      const url = error.config?.url || "";
      const isCartClearRequest = url.includes("/api/cart/clear");

      if (!isCartClearRequest) {
        console.warn(
          "Unauthorized! Clearing token and redirecting to login...",
        );
        // Xóa token khỏi localStorage
        localStorage.removeItem("token");
        // Không redirect tự động để tránh làm gián đoạn flow của ứng dụng
        // Component có thể tự xử lý việc redirect dựa trên token state
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
