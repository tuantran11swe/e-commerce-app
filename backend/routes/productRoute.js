import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
} from "../controllers/productController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { uploadMultipleImages } from "../middleware/multer.js";

// Khởi tạo router
const router = express.Router();

/**
 * Route thêm sản phẩm mới (chỉ Admin)
 * POST /api/product/add
 * Body: form-data với các field:
 *   - name: Tên sản phẩm (bắt buộc)
 *   - price: Giá sản phẩm (bắt buộc)
 *   - description: Mô tả sản phẩm (bắt buộc)
 *   - category: Danh mục sản phẩm (bắt buộc)
 *   - subcategory: Danh mục con (tùy chọn)
 *   - sizes: Kích thước sản phẩm, phân cách bằng dấu phẩy (tùy chọn)
 *   - bestseller: true/false (tùy chọn, mặc định false)
 *   - images: File ảnh (bắt buộc, có thể upload nhiều ảnh)
 * Headers: Authorization: Bearer <admin_token>
 */
router.post(
  "/add",
  adminAuth, // Xác thực Admin trước
  uploadMultipleImages, // Xử lý upload nhiều ảnh
  addProduct,
);

/**
 * Route lấy danh sách tất cả sản phẩm (public)
 * GET /api/product/list
 * Query params (tùy chọn):
 *   - category: Lọc theo danh mục
 *   - subcategory: Lọc theo danh mục con
 *   - bestseller: true/false để lọc sản phẩm bán chạy
 *   - page: Số trang (mặc định 1)
 *   - limit: Số sản phẩm mỗi trang (mặc định 20)
 */
router.get("/list", listProducts);

/**
 * Route lấy chi tiết một sản phẩm theo ID (public)
 * GET /api/product/:productId
 * Params:
 *   - productId: ID của sản phẩm
 */
router.get("/:productId", singleProduct);

/**
 * Route xóa sản phẩm theo ID (chỉ Admin)
 * DELETE /api/product/:productId
 * Params:
 *   - productId: ID của sản phẩm
 * Headers: Authorization: Bearer <admin_token>
 */
router.delete("/:productId", adminAuth, removeProduct);

export default router;
