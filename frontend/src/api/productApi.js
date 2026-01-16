import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/config.js";

/**
 * Fetch all products from backend API
 * @param {Object} params - Query parameters for filtering
 * @param {string} params.category - Filter by category
 * @param {string} params.subcategory - Filter by subcategory
 * @param {boolean} params.bestseller - Filter bestsellers
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of items per page
 * @returns {Promise<Object>} Response with products array and pagination info
 */
export const fetchProducts = async (params = {}) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.LIST}`,
      {
        params,
      },
    );

    // Backend trả về: { success: true, data: { products: [...], pagination: {...} }, message: "..." }
    if (response.data.success) {
      return {
        pagination: response.data.data.pagination || null,
        products: response.data.data.products || [],
      };
    }

    throw new Error(
      response.data.message || "Không thể tải danh sách sản phẩm",
    );
  } catch (error) {
    console.error("Error fetching products:", error);

    // Xử lý các loại lỗi khác nhau
    if (error.response) {
      // Server trả về lỗi (4xx, 5xx)
      throw new Error(
        error.response.data.message ||
          "Lỗi khi tải danh sách sản phẩm từ server",
      );
    }
    if (error.request) {
      // Request được gửi nhưng không nhận được response
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
      );
    }
    // Lỗi khác
    throw new Error(error.message || "Đã xảy ra lỗi không xác định");
  }
};

/**
 * Fetch a single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Product object
 */
export const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.SINGLE(productId)}`,
    );

    if (response.data.success) {
      return response.data.data.product;
    }

    throw new Error(
      response.data.message || "Không thể tải thông tin sản phẩm",
    );
  } catch (error) {
    console.error("Error fetching product:", error);

    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "Lỗi khi tải thông tin sản phẩm từ server",
      );
    }
    if (error.request) {
      throw new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
      );
    }
    throw new Error(error.message || "Đã xảy ra lỗi không xác định");
  }
};
