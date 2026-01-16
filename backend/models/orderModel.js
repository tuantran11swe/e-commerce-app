import mongoose from "mongoose";

/**
 * Schema định nghĩa cấu trúc của một sản phẩm trong đơn hàng
 * Mỗi đơn hàng có thể chứa nhiều sản phẩm với số lượng và kích thước khác nhau
 */
const orderItemSchema = new mongoose.Schema(
  {
    // ID sản phẩm, tham chiếu đến collection Product
    productId: {
      ref: "Product", // Tên model được tham chiếu
      required: true, // Bắt buộc phải có
      type: mongoose.Schema.Types.ObjectId, // Kiểu dữ liệu là MongoDB ObjectId
    },
    // Số lượng sản phẩm trong đơn hàng
    quantity: {
      min: 1, // Số lượng tối thiểu là 1
      required: true, // Bắt buộc phải có
      type: Number, // Kiểu dữ liệu là số
    },
    // Kích thước sản phẩm (ví dụ: S, M, L, XL)
    size: {
      trim: true, // Tự động loại bỏ khoảng trắng ở đầu và cuối
      type: String, // Kiểu dữ liệu là chuỗi
    },
  },
  { _id: false }, // Không tạo _id riêng cho subdocument này
);

/**
 * Schema định nghĩa cấu trúc của một đơn hàng trong hệ thống
 * Mỗi đơn hàng bao gồm thông tin người dùng, sản phẩm, địa chỉ giao hàng và trạng thái thanh toán
 */
const orderSchema = new mongoose.Schema(
  {
    // Thông tin địa chỉ giao hàng (object chứa các trường như: tên, số điện thoại, địa chỉ chi tiết)
    address: {
      required: true, // Bắt buộc phải có
      type: Object, // Kiểu dữ liệu là object
    },
    // Tổng tiền của đơn hàng
    amount: {
      min: 0, // Tổng tiền tối thiểu là 0
      required: true, // Bắt buộc phải có
      type: Number, // Kiểu dữ liệu là số
    },
    // Danh sách sản phẩm trong đơn hàng (mảng các orderItemSchema)
    items: {
      default: [], // Giá trị mặc định là mảng rỗng
      required: true, // Bắt buộc phải có
      type: [orderItemSchema], // Kiểu dữ liệu là mảng các orderItemSchema
    },
    // Trạng thái thanh toán (true: đã thanh toán, false: chưa thanh toán)
    payment: {
      default: false, // Mặc định là chưa thanh toán
      type: Boolean, // Kiểu dữ liệu là boolean
    },
    // Phương thức thanh toán (ví dụ: COD - Cash on Delivery, Credit Card, etc.)
    paymentMethod: {
      default: "COD", // Mặc định là COD (Thanh toán khi nhận hàng)
      trim: true, // Tự động loại bỏ khoảng trắng ở đầu và cuối
      type: String, // Kiểu dữ liệu là chuỗi
    },
    // Trạng thái đơn hàng (ví dụ: "Đang xử lý", "Đang giao hàng", "Đã giao hàng", "Đã hủy")
    status: {
      default: "Đang xử lý", // Mặc định là "Đang xử lý"
      trim: true, // Tự động loại bỏ khoảng trắng ở đầu và cuối
      type: String, // Kiểu dữ liệu là chuỗi
    },
    // ID người dùng đặt hàng, tham chiếu đến collection User
    userId: {
      ref: "User", // Tên model được tham chiếu
      required: true, // Bắt buộc phải có
      type: mongoose.Schema.Types.ObjectId, // Kiểu dữ liệu là MongoDB ObjectId
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  },
);

/**
 * Virtual field để lấy timestamp của ngày tạo đơn hàng
 * Trả về timestamp (milliseconds) của createdAt, hoặc timestamp hiện tại nếu không có createdAt
 */
orderSchema.virtual("date").get(function () {
  return this.createdAt ? this.createdAt.getTime() : Date.now();
});

// Cấu hình để virtual fields được bao gồm khi chuyển đổi sang JSON
orderSchema.set("toJSON", { virtuals: true });
// Cấu hình để virtual fields được bao gồm khi chuyển đổi sang Object
orderSchema.set("toObject", { virtuals: true });

// Tạo index để tối ưu truy vấn theo thời gian tạo và userId (sắp xếp giảm dần)
orderSchema.index({ createdAt: -1, userId: 1 });
// Tạo index để tối ưu truy vấn theo trạng thái đơn hàng
orderSchema.index({ status: 1 });

// Tạo model Order từ schema và export để sử dụng trong các file khác
const Order = mongoose.model("Order", orderSchema);

export default Order;
