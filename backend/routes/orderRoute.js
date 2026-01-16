import express from "express";
import {
  allOrders,
  placeOrder,
  updateStatus,
  userOrders,
} from "../controllers/orderController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { userAuth } from "../middleware/userAuth.js";

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
 * GET /api/orders/user
 * Yêu cầu: Người dùng phải đăng nhập (userAuth middleware)
 * Trả về: Danh sách tất cả đơn hàng của người dùng đã đăng nhập
 */
router.get("/user", userAuth, userOrders);

/**
 * Route lấy danh sách tất cả đơn hàng (chỉ dành cho admin)
 * GET /api/orders/all
 * Yêu cầu: Phải là admin (adminAuth middleware)
 * Trả về: Danh sách tất cả đơn hàng trong hệ thống
 */
router.get("/all", adminAuth, allOrders);

/**
 * Route cập nhật trạng thái đơn hàng (chỉ dành cho admin)
 * PUT /api/orders/:orderId/status
 * Yêu cầu: Phải là admin (adminAuth middleware)
 * Params: orderId - ID của đơn hàng cần cập nhật
 * Body: { status } - Trạng thái mới của đơn hàng
 */
router.put("/:orderId/status", adminAuth, updateStatus);

export default router;
