import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

// Lấy đường dẫn thư mục hiện tại (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Cấu hình storage cho Multer sử dụng diskStorage
 * Lưu file tạm thời vào thư mục uploads trước khi upload lên Cloudinary
 */
const storage = multer.diskStorage({
  /**
   * Xác định thư mục lưu file tạm thời
   * @param {Object} req - Request object
   * @param {Object} file - File object từ client
   * @param {Function} cb - Callback function
   */
  destination: (_req, _file, cb) => {
    // Lưu file vào thư mục uploads trong thư mục backend
    cb(null, path.join(__dirname, "../uploads"));
  },

  /**
   * Xác định tên file khi lưu
   * @param {Object} req - Request object
   * @param {Object} file - File object từ client
   * @param {Function} cb - Callback function
   */
  filename: (_req, file, cb) => {
    // Tạo tên file duy nhất: timestamp + tên file gốc
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    const fileNameWithoutExt = path.basename(file.originalname, fileExtension);
    // Loại bỏ ký tự đặc biệt và khoảng trắng trong tên file
    const sanitizedFileName = fileNameWithoutExt
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    cb(null, `${sanitizedFileName}-${uniqueSuffix}${fileExtension}`);
  },
});

/**
 * Filter để kiểm tra loại file được phép upload
 * Chỉ cho phép upload các file ảnh (jpg, jpeg, png, gif, webp)
 * @param {Object} req - Request object
 * @param {Object} file - File object từ client
 * @param {Function} cb - Callback function
 */
const fileFilter = (_req, file, cb) => {
  // Danh sách các định dạng ảnh được phép
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  // Kiểm tra xem file có phải là ảnh không
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Cho phép upload
  } else {
    cb(
      new Error("Chỉ cho phép upload file ảnh (jpg, jpeg, png, gif, webp)"),
      false, // Từ chối upload
    );
  }
};

/**
 * Cấu hình Multer middleware
 * - Storage: diskStorage để lưu file tạm thời
 * - File filter: Chỉ cho phép upload ảnh
 * - Limits: Giới hạn kích thước file tối đa là 5MB
 */
const upload = multer({
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  storage,
});

/**
 * Middleware để xử lý upload nhiều ảnh
 * Sử dụng field name "images" và cho phép tối đa 10 ảnh
 */
export const uploadMultipleImages = upload.array("images", 10);

/**
 * Middleware để xử lý upload một ảnh
 * Sử dụng field name "image"
 */
export const uploadSingleImage = upload.single("image");

export default upload;
