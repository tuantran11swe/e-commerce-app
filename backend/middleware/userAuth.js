import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

/**
 * Middleware xác thực người dùng bằng JWT token
 * Kiểm tra và xác thực token JWT từ header Authorization
 * Nếu token hợp lệ, thêm thông tin người dùng vào request object để các route handler sử dụng
 *
 * @param {Object} req - Request object chứa header Authorization
 * @param {Object} res - Response object để trả về lỗi nếu xác thực thất bại
 * @param {Function} next - Function để chuyển sang middleware/route handler tiếp theo nếu xác thực thành công
 * @returns {Promise<void>} Gọi next() nếu xác thực thành công, hoặc trả về lỗi nếu thất bại
 */
export const userAuth = async (req, res, next) => {
  try {
    // Lấy header Authorization từ request
    const authHeader = req.headers.authorization;

    // console.log("Auth Header Received:", authHeader); // Debug log

    // Kiểm tra header Authorization có tồn tại và bắt đầu bằng "Bearer " không
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No Bearer token found in headers"); // Debug log
      return res.status(401).json({
        message: "Không có token xác thực. Vui lòng đăng nhập lại",
        success: false,
      });
    }

    // Tách token từ chuỗi "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
      console.log("Token is null or undefined string"); // Debug log
      return res.status(401).json({
        message: "Token không hợp lệ. Vui lòng đăng nhập lại",
        success: false,
      });
    }

    // Kiểm tra JWT_SECRET có được cấu hình trong environment variables không
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Lỗi cấu hình server. Vui lòng liên hệ quản trị viên",
        success: false,
      });
    }

    // Xác thực và giải mã token bằng JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra token có chứa userId không (điều kiện bắt buộc)
    if (!decoded?.userId) {
      return res.status(401).json({
        message: "Token không hợp lệ. Vui lòng đăng nhập lại",
        success: false,
      });
    }

    // Thêm thông tin người dùng vào request object để các route handler có thể sử dụng
    req.user = {
      email: decoded.email, // Email người dùng từ token
      userId: decoded.userId, // ID người dùng từ token
    };

    // Chuyển sang middleware/route handler tiếp theo
    next();
  } catch (error) {
    // Xử lý lỗi khi token không đúng định dạng hoặc bị giả mạo
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token không hợp lệ. Vui lòng đăng nhập lại",
        success: false,
      });
    }

    // Xử lý lỗi khi token đã hết hạn
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token đã hết hạn. Vui lòng đăng nhập lại",
        success: false,
      });
    }

    // Xử lý các lỗi server khác
    return res.status(500).json({
      message: "Lỗi server khi xác thực. Vui lòng thử lại sau",
      success: false,
    });
  }
};
