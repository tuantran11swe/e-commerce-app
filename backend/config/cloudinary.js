import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load các biến môi trường từ file .env
dotenv.config();

// Cấu hình Cloudinary với các thông tin từ biến môi trường
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

/**
 * Upload ảnh lên Cloudinary
 * @param {string} filePath - Đường dẫn đến file ảnh cần upload
 * @param {string} folder - Thư mục trên Cloudinary để lưu ảnh (tùy chọn)
 * @param {Object} options - Các tùy chọn bổ sung cho việc upload (tùy chọn)
 * @returns {Promise<Object>} - Kết quả upload chứa URL và các thông tin khác
 */
export const uploadImage = async (
  filePath,
  folder = "ecommerce",
  options = {},
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      ...options,
    });
    return result;
  } catch (error) {
    console.error("Lỗi khi upload ảnh lên Cloudinary:", error);
    throw error;
  }
};

/**
 * Upload ảnh từ buffer (dữ liệu trong bộ nhớ)
 * @param {Buffer} buffer - Buffer chứa dữ liệu ảnh
 * @param {string} folder - Thư mục trên Cloudinary để lưu ảnh (tùy chọn)
 * @param {Object} options - Các tùy chọn bổ sung cho việc upload (tùy chọn)
 * @returns {Promise<Object>} - Kết quả upload chứa URL và các thông tin khác
 */
export const uploadImageFromBuffer = async (
  buffer,
  folder = "ecommerce",
  options = {},
) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          ...options,
        },
        (error, result) => {
          if (error) {
            console.error(
              "Lỗi khi upload ảnh từ buffer lên Cloudinary:",
              error,
            );
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Lỗi khi upload ảnh từ buffer lên Cloudinary:", error);
    throw error;
  }
};

/**
 * Xóa ảnh khỏi Cloudinary
 * @param {string} publicId - Public ID của ảnh trên Cloudinary
 * @returns {Promise<Object>} - Kết quả xóa
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Lỗi khi xóa ảnh khỏi Cloudinary:", error);
    throw error;
  }
};

/**
 * Lấy URL của ảnh với các tùy chọn transform
 * @param {string} publicId - Public ID của ảnh trên Cloudinary
 * @param {Object} options - Các tùy chọn transform (width, height, crop, quality, etc.)
 * @returns {string} - URL của ảnh đã được transform
 */
export const getImageUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, options);
};

// Export instance của cloudinary để sử dụng trực tiếp nếu cần
export default cloudinary;
