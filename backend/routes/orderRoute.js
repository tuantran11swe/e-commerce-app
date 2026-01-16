import express from "express";
import {
  allOrders,
  placeOrder,
  updateStatus,
  userOrders,
} from "../controllers/orderController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { userAuth } from "../middleware/userAuth.js";
import Order from "../models/orderModel.js";

// Tạo router instance để định nghĩa các routes cho đơn hàng
const router = express.Router();

/**
 * Route đặt hàng mới
 * POST /api/orders/place
 * Yêu cầu: Người dùng phải đăng nhập (userAuth middleware)
 * Body: { items, amount, address, paymentMethod }
 */
router.post("/place", userAuth, placeOrder);

/**
 * Route lấy lịch sử đơn hàng của người dùng hiện tại
 * GET /api/order/user
 * Yêu cầu: Người dùng phải đăng nhập (userAuth middleware)
 * Trả về: Danh sách tất cả đơn hàng của người dùng đã đăng nhập
 */
router.get("/user", userAuth, userOrders);

/**
 * Route lấy danh sách tất cả đơn hàng (chỉ dành cho admin)
 * GET /api/order/all
 * Yêu cầu: Phải là admin (adminAuth middleware)
 * Trả về: Danh sách tất cả đơn hàng trong hệ thống
 * Lưu ý: Route này phải được đặt trước route /:orderId để tránh conflict
 */
router.get("/all", adminAuth, allOrders);

/**
 * Route lấy chi tiết một đơn hàng theo ID
 * GET /api/order/:orderId
 * Yêu cầu: Người dùng phải đăng nhập (userAuth middleware)
 */
router.get("/:orderId", userAuth, async (req, res) => {
  // Placeholder for single order detail if needed by frontend
  // For now just implementing the route to avoid 404
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "items.productId",
      "name images price",
    );
    if (!order) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đơn hàng", success: false });
    }

    // Chuẩn hóa dữ liệu tương tự như danh sách
    const orderObj = order.toObject();
    orderObj.items = orderObj.items.map((item) => {
      if (item.productId) {
        return {
          ...item,
          images: item.productId.images,
          name: item.productId.name,
          price: item.productId.price,
          productId: item.productId._id,
        };
      }
      return item;
    });
    // Chuẩn hóa địa chỉ: thêm shippingAddress từ address để tương thích với frontend
    if (orderObj.address && typeof orderObj.address === "object") {
      orderObj.shippingAddress = orderObj.address;
    }

    res.status(200).json({ data: { order: orderObj }, success: true });
  } catch (error) {
    if (error.name === "CastError") {
      return res
        .status(400)
        .json({ message: "ID đơn hàng không hợp lệ", success: false });
    }
    res.status(500).json({ message: "Lỗi server", success: false });
  }
});

/**
 * Route cập nhật trạng thái đơn hàng (chỉ dành cho admin)
 * PUT /api/orders/:orderId/status
 * Yêu cầu: Phải là admin (adminAuth middleware)
 * Params: orderId - ID của đơn hàng cần cập nhật
 * Body: { status } - Trạng thái mới của đơn hàng
 */
router.put("/:orderId/status", adminAuth, updateStatus);

export default router;
