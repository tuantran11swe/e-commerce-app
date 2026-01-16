import { API_ENDPOINTS } from "../config/config.js";
import axiosInstance from "./axiosConfig.js";

/**
 * API client cho order management
 */

/**
 * Tạo đơn hàng mới
 * @param {Object} orderData - Thông tin đơn hàng
 * @param {Object} orderData.address - Địa chỉ giao hàng
 * @param {string} orderData.address.firstName - Họ
 * @param {string} orderData.address.lastName - Tên
 * @param {string} orderData.address.email - Email
 * @param {string} orderData.address.street - Địa chỉ đường phố
 * @param {string} orderData.address.city - Thành phố
 * @param {string} orderData.address.state - Tỉnh/Thành phố
 * @param {string} orderData.address.zipcode - Mã bưu điện
 * @param {string} orderData.address.country - Quốc gia
 * @param {string} orderData.address.phone - Số điện thoại
 * @param {Array} orderData.items - Danh sách sản phẩm
 * @param {number} orderData.amount - Tổng tiền
 * @param {string} orderData.paymentMethod - Phương thức thanh toán (cod, stripe, razorpay)
 * @returns {Promise<Object>} Created order
 */
export const placeOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.ORDER.PLACE,
      orderData,
    );

    if (response.data.success) {
      return {
        message: response.data.message,
        order: response.data.data.order,
        success: true,
      };
    }

    throw new Error(response.data.message || "Không thể tạo đơn hàng");
  } catch (error) {
    console.error("Place order error:", error);
    throw error;
  }
};

/**
 * Lấy danh sách đơn hàng của user
 * @returns {Promise<Object>} List of orders
 */
export const getUserOrders = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ORDER.USER_ORDERS);

    if (response.data.success) {
      return {
        orders: response.data.data.orders || [],
        success: true,
      };
    }

    throw new Error(
      response.data.message || "Không thể lấy danh sách đơn hàng",
    );
  } catch (error) {
    console.error("Get user orders error:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết một đơn hàng
 * @param {string} orderId - ID đơn hàng
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.ORDER.DETAIL(orderId),
    );

    if (response.data.success) {
      return {
        order: response.data.data.order,
        success: true,
      };
    }

    throw new Error(
      response.data.message || "Không thể lấy thông tin đơn hàng",
    );
  } catch (error) {
    console.error("Get order by ID error:", error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái đơn hàng (dành cho admin)
 * @param {string} orderId - ID đơn hàng
 * @param {string} status - Trạng thái mới
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axiosInstance.put(
      API_ENDPOINTS.ORDER.DETAIL(orderId),
      { status },
    );

    if (response.data.success) {
      return {
        message: response.data.message,
        order: response.data.data.order,
        success: true,
      };
    }

    throw new Error(response.data.message || "Không thể cập nhật trạng thái");
  } catch (error) {
    console.error("Update order status error:", error);
    throw error;
  }
};
