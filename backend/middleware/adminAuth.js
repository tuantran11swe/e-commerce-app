import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// Load các biến môi trường từ file .env
dotenv.config();

/**
 * Middleware xác thực quyền Admin
 * Giải mã token từ header request và kiểm tra xem user có phải Admin không
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {Promise<void>}
 */
export const adminAuth = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    // Kiểm tra xem có token không
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Không có token xác thực. Vui lòng đăng nhập lại",
        success: false,
      });
    }

    // Lấy token từ header (bỏ phần "Bearer ")
    const token = authHeader.split(" ")[1];

    // Kiểm tra xem có JWT_SECRET không
    if (!process.env.JWT_SECRET) {
      console.error("Lỗi: JWT_SECRET chưa được cấu hình");
      return res.status(500).json({
        message: "Lỗi cấu hình server. Vui lòng liên hệ quản trị viên",
        success: false,
      });
    }

    // Giải mã token để lấy thông tin user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra xem user có phải Admin không
    // Admin token có role: "admin" và email khớp với ADMIN_EMAIL
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error("Lỗi: ADMIN_EMAIL chưa được cấu hình");
      return res.status(500).json({
        message: "Lỗi cấu hình server. Vui lòng liên hệ quản trị viên",
        success: false,
      });
    }

    // Kiểm tra role và email
    const isAdmin =
      decoded.role === "admin" &&
      decoded.email?.toLowerCase() === adminEmail.toLowerCase();

    if (!isAdmin) {
      return res.status(403).json({
        message:
          "Bạn không có quyền truy cập. Chỉ Admin mới được phép thực hiện thao tác này",
        success: false,
      });
    }

    // Lưu thông tin Admin vào request để sử dụng ở các middleware/controller tiếp theo
    req.admin = {
      email: decoded.email,
      role: decoded.role,
      userId: decoded.userId,
    };

    // Cho phép request tiếp tục đến route handler
    next();
  } catch (error) {
    // Xử lý các lỗi khác nhau
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token không hợp lệ. Vui lòng đăng nhập lại",
        success: false,
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token đã hết hạn. Vui lòng đăng nhập lại",
        success: false,
      });
    }

    // Lỗi khác
    console.error("Lỗi khi xác thực Admin:", error);
    return res.status(500).json({
      message: "Lỗi server khi xác thực. Vui lòng thử lại sau",
      success: false,
    });
  }
};
