import { API_ENDPOINTS } from "../config/config.js";
import axiosInstance from "./axiosConfig.js";

/**
 * API client cho cart management
 */

/**
 * Lấy giỏ hàng của user từ server
 * @returns {Promise<Object>} Cart data
 */
export const getCart = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.CART.GET);

    if (response.data.success) {
      return {
        cart: response.data.data.cart || {},
        success: true,
      };
    }

    throw new Error(response.data.message || "Không thể lấy giỏ hàng");
  } catch (error) {
    console.error("Get cart error:", error);
    throw error;
  }
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {string} productId - ID sản phẩm
 * @param {string} size - Kích thước
 * @param {number} quantity - Số lượng (mặc định 1)
 * @returns {Promise<Object>} Updated cart
 */
export const addToCart = async (productId, size, quantity = 1) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD, {
      productId,
      quantity,
      size,
    });

    if (response.data.success) {
      return {
        cart: response.data.data.cart,
        message: response.data.message,
        success: true,
      };
    }

    throw new Error(response.data.message || "Không thể thêm vào giỏ hàng");
  } catch (error) {
    console.error("Add to cart error:", error);
    throw error;
  }
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * @param {string} productId - ID sản phẩm
 * @param {string} size - Kích thước
 * @param {number} quantity - Số lượng mới
 * @returns {Promise<Object>} Updated cart
 */
export const updateCart = async (productId, size, quantity) => {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.CART.UPDATE, {
      productId,
      quantity,
      size,
    });

    if (response.data.success) {
      return {
        cart: response.data.data.cart,
        message: response.data.message,
        success: true,
      };
    }

    throw new Error(response.data.message || "Không thể cập nhật giỏ hàng");
  } catch (error) {
    console.error("Update cart error:", error);
    throw error;
  }
};

/**
 * Xóa sản phẩm khỏi giỏ hàng (bằng cách set quantity = 0)
 * @param {string} productId - ID sản phẩm
 * @param {string} size - Kích thước
 * @returns {Promise<Object>} Updated cart
 */
export const removeFromCart = async (productId, size) => {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.CART.UPDATE, {
      productId,
      quantity: 0,
      size,
    });

    if (response.data.success) {
      return {
        cart: response.data.data.cart,
        message: response.data.message,
        success: true,
      };
    }

    throw new Error(response.data.message || "Không thể xóa sản phẩm");
  } catch (error) {
    console.error("Remove from cart error:", error);
    throw error;
  }
};

/**
 * Đồng bộ giỏ hàng từ localStorage lên server
 * Dùng khi user đăng nhập và có giỏ hàng trong localStorage
 * @param {Object} cartData - Dữ liệu giỏ hàng từ localStorage
 * @returns {Promise<Object>} Merged cart
 */
export const syncCart = async (cartData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.CART.SYNC, {
      cart: cartData,
    });

    if (response.data.success) {
      return {
        cart: response.data.data.cart,
        message: response.data.message,
        success: true,
      };
    }

    throw new Error(response.data.message || "Không thể đồng bộ giỏ hàng");
  } catch (error) {
    console.error("Sync cart error:", error);
    throw error;
  }
};

/**
 * Xóa toàn bộ giỏ hàng
 * @returns {Promise<Object>} Empty cart
 */
export const clearCart = async () => {
  try {
    const response = await axiosInstance.delete(API_ENDPOINTS.CART.CLEAR);

    if (response.data.success) {
      return {
        message: response.data.message,
        success: true,
      };
    }

    throw new Error(response.data.message || "Không thể xóa giỏ hàng");
  } catch (error) {
    console.error("Clear cart error:", error);
    throw error;
  }
};
