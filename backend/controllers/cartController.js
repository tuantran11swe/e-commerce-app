import User from "../models/userModel.js";

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {Object} req - Request object chứa productId, size, quantity
 * @param {Object} res - Response object
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;
    const userId = req.user.userId;

    const userData = await User.findById(userId);
    const cartData = userData.cartData || {};

    if (!cartData[productId]) {
      cartData[productId] = {};
    }

    if (cartData[productId][size]) {
      cartData[productId][size] += quantity;
    } else {
      cartData[productId][size] = quantity;
    }

    await User.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({
      data: { cart: cartData },
      message: "Đã thêm vào giỏ hàng",
      success: true,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      message: "Lỗi server khi thêm vào giỏ hàng",
      success: false,
    });
  }
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * @param {Object} req - Request object chứa productId, size, quantity
 * @param {Object} res - Response object
 */
export const updateCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const userId = req.user.userId;

    const userData = await User.findById(userId);
    const cartData = userData.cartData || {};

    if (cartData[productId]) {
      if (quantity > 0) {
        cartData[productId][size] = quantity;
      } else {
        delete cartData[productId][size];
        if (Object.keys(cartData[productId]).length === 0) {
          delete cartData[productId];
        }
      }
    }

    await User.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({
      data: { cart: cartData },
      message: "Đã cập nhật giỏ hàng",
      success: true,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      message: "Lỗi server khi cập nhật giỏ hàng",
      success: false,
    });
  }
};

/**
 * Lấy dữ liệu giỏ hàng của người dùng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userData = await User.findById(userId);
    const cartData = userData.cartData || {};

    res.status(200).json({
      data: { cart: cartData },
      message: "Lấy giỏ hàng thành công",
      success: true,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      message: "Lỗi server khi lấy giỏ hàng",
      success: false,
    });
  }
};

/**
 * Đồng bộ giỏ hàng từ client lên server
 * @param {Object} req - Request object chứa cart object
 * @param {Object} res - Response object
 */
export const syncCart = async (req, res) => {
  try {
    const { cart } = req.body;
    const userId = req.user.userId;

    // Trong thực tế có thể cần merge thay vì overwrite hoàn toàn
    // Ở đây ta overwrite theo logic sync đơn giản
    await User.findByIdAndUpdate(userId, { cartData: cart });

    res.status(200).json({
      message: "Đồng bộ giỏ hàng thành công",
      success: true,
    });
  } catch (error) {
    console.error("Sync cart error:", error);
    res.status(500).json({
      message: "Lỗi server khi đồng bộ giỏ hàng",
      success: false,
    });
  }
};

/**
 * Xóa toàn bộ giỏ hàng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.status(200).json({
      message: "Đã xóa giỏ hàng",
      success: true,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      message: "Lỗi server khi xóa giỏ hàng",
      success: false,
    });
  }
};
