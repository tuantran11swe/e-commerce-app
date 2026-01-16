import { API_ENDPOINTS } from "../config/config.js";
import axiosInstance from "./axiosConfig.js";

/**
 * API client cho authentication và user management
 */

/**
 * Đăng nhập người dùng
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu
 * @returns {Promise<Object>} Response với token và user data
 */
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.USER.LOGIN, {
      email,
      password,
    });

    if (response.data.success) {
      return {
        message: response.data.message,
        success: true,
        token: response.data.data.token,
        user: response.data.data.user || null,
      };
    }

    throw new Error(response.data.message || "Đăng nhập thất bại");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Đăng ký người dùng mới
 * @param {string} name - Tên người dùng
 * @param {string} email - Email
 * @param {string} password - Mật khẩu
 * @returns {Promise<Object>} Response với token và user data
 */
export const register = async (name, email, password) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.USER.REGISTER, {
      email,
      name,
      password,
    });

    if (response.data.success) {
      return {
        message: response.data.message,
        success: true,
        token: response.data.data.token,
        user: response.data.data.user || null,
      };
    }

    throw new Error(response.data.message || "Đăng ký thất bại");
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

/**
 * Lấy thông tin profile người dùng
 * @returns {Promise<Object>} User profile data
 */
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.USER.PROFILE);

    if (response.data.success) {
      return {
        success: true,
        user: response.data.data.user,
      };
    }

    throw new Error(response.data.message || "Không thể lấy thông tin user");
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin profile
 * @param {Object} userData - Dữ liệu cần cập nhật
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (userData) => {
  try {
    const response = await axiosInstance.put(
      API_ENDPOINTS.USER.PROFILE,
      userData,
    );

    if (response.data.success) {
      return {
        message: response.data.message,
        success: true,
        user: response.data.data.user,
      };
    }

    throw new Error(response.data.message || "Cập nhật thất bại");
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

/**
 * Đăng xuất người dùng
 * @returns {Promise<Object>} Logout response
 */
export const logout = async () => {
  try {
    // Gọi API logout nếu backend hỗ trợ (để invalidate token)
    const response = await axiosInstance.post(API_ENDPOINTS.USER.LOGOUT);

    // Xóa token khỏi localStorage
    localStorage.removeItem("token");

    return {
      message: response.data.message || "Đăng xuất thành công",
      success: true,
    };
  } catch (error) {
    // Vẫn xóa token dù API lỗi
    localStorage.removeItem("token");

    console.error("Logout error:", error);
    // Không throw error vì đăng xuất vẫn thành công ở client
    return {
      message: "Đăng xuất thành công",
      success: true,
    };
  }
};
