import bcrypt from "bcrypt";
import mongoose from "mongoose";

/**
 * Schema định nghĩa cấu trúc dữ liệu người dùng trong hệ thống e-commerce
 * Bao gồm thông tin đăng nhập và dữ liệu giỏ hàng
 */
const userSchema = new mongoose.Schema(
  {
    /**
     * Dữ liệu giỏ hàng của người dùng
     * minimize: false đảm bảo object rỗng vẫn được lưu trong database
     * Giúp dễ dàng thêm sản phẩm vào giỏ hàng sau này
     */
    cartData: {
      default: {},
      minimize: false, // Giữ object rỗng trong database
      type: Object,
    },

    /**
     * Email đăng nhập của người dùng
     * Phải là duy nhất trong hệ thống và đúng định dạng email
     */
    email: {
      lowercase: true, // Chuyển về chữ thường để dễ so sánh
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email không đúng định dạng"], // Validate định dạng email
      required: [true, "Email là bắt buộc"],
      trim: true,
      type: String,
      unique: true, // Đảm bảo email là duy nhất
    },
    /**
     * Tên người dùng - bắt buộc phải có
     */
    name: {
      maxLength: [100, "Tên người dùng không được vượt quá 100 ký tự"],
      required: [true, "Tên người dùng là bắt buộc"],
      trim: true, // Loại bỏ khoảng trắng ở đầu và cuối
      type: String,
    },

    /**
     * Mật khẩu đã được mã hóa của người dùng
     * Sẽ được hash bằng bcrypt trước khi lưu vào database
     */
    password: {
      minLength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      required: [true, "Mật khẩu là bắt buộc"],
      select: false, // Không trả về password khi query (bảo mật)
      type: String,
    },
  },
  {
    /**
     * Tự động thêm timestamps (createdAt và updatedAt)
     * Mongoose sẽ tự động quản lý các trường này
     */
    timestamps: true,
  },
);

/**
 * Middleware chạy trước khi lưu user vào database
 * Tự động hash mật khẩu nếu mật khẩu được thay đổi
 * Trong Mongoose 7+, async function không cần tham số next
 */
userSchema.pre("save", async function () {
  // Chỉ hash mật khẩu nếu mật khẩu được thay đổi (mới hoặc đã chỉnh sửa)
  if (!this.isModified("password")) {
    return;
  }

  // Hash mật khẩu với salt rounds = 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Method để so sánh mật khẩu người dùng nhập với mật khẩu đã hash trong database
 * @param {string} candidatePassword - Mật khẩu người dùng nhập vào
 * @returns {Promise<boolean>} - true nếu mật khẩu khớp, false nếu không khớp
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Tạo index cho email để tăng hiệu suất tìm kiếm
 * Email đã được đánh dấu unique nên index sẽ tự động được tạo
 * Nhưng có thể thêm index để tối ưu hóa truy vấn
 */
userSchema.index({ email: 1 });

/**
 * Tạo model User từ schema
 * Model này sẽ được sử dụng để tương tác với collection "users" trong MongoDB
 */
const User = mongoose.model("User", userSchema);

export default User;
