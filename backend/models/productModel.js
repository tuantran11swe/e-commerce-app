import mongoose from "mongoose";

/**
 * Schema định nghĩa cấu trúc dữ liệu sản phẩm trong hệ thống e-commerce
 * Bao gồm thông tin cơ bản, hình ảnh, phân loại và trạng thái bán hàng
 */
const productSchema = new mongoose.Schema(
  {
    /**
     * Trạng thái bán chạy của sản phẩm
     * true: Sản phẩm bán chạy
     * false: Sản phẩm thường
     */
    bestseller: {
      default: false,
      type: Boolean,
    },

    /**
     * Danh mục chính của sản phẩm
     * Ví dụ: Nữ, Nam, Trẻ em
     */
    category: {
      required: [true, "Danh mục sản phẩm là bắt buộc"],
      trim: true,
      type: String,
    },

    /**
     * Mô tả chi tiết về sản phẩm
     */
    description: {
      maxLength: [5000, "Mô tả sản phẩm không được vượt quá 5000 ký tự"],
      required: [true, "Mô tả sản phẩm là bắt buộc"],
      trim: true,
      type: String,
    },

    /**
     * Mảng chứa các URL hình ảnh của sản phẩm
     * Mỗi sản phẩm có thể có nhiều hình ảnh
     */
    images: {
      required: [true, "Sản phẩm phải có ít nhất một hình ảnh"],
      type: [String],
      validate: {
        message: "Sản phẩm phải có ít nhất một hình ảnh",
        validator: (images) => images.length > 0,
      },
    },
    /**
     * Tên sản phẩm - bắt buộc phải có
     */
    name: {
      maxLength: [200, "Tên sản phẩm không được vượt quá 200 ký tự"],
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true, // Loại bỏ khoảng trắng ở đầu và cuối
      type: String,
    },

    /**
     * Giá bán của sản phẩm (đơn vị: VNĐ hoặc currency tùy hệ thống)
     * Sử dụng Number với min để đảm bảo giá không âm
     */
    price: {
      min: [0, "Giá sản phẩm không được nhỏ hơn 0"],
      required: [true, "Giá sản phẩm là bắt buộc"],
      type: Number,
    },

    /**
     * Mảng chứa các kích thước có sẵn của sản phẩm
     * Ví dụ: ["S", "M", "L", "XL"] hoặc ["38", "39", "40", "41"]
     */
    sizes: {
      default: [],
      type: [String],
    },

    /**
     * Danh mục con của sản phẩm
     * Ví dụ: Áo, Quần, Đồ mùa đông
     */
    subcategory: {
      trim: true,
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
 * Virtual field để tương thích với frontend
 * Trả về timestamp dạng số từ createdAt
 */
productSchema.virtual("date").get(function () {
  return this.createdAt ? this.createdAt.getTime() : Date.now();
});

/**
 * Đảm bảo virtual fields được include khi convert sang JSON
 */
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

/**
 * Tạo index cho các trường thường được sử dụng để tìm kiếm
 * Giúp tăng hiệu suất truy vấn
 */
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ bestseller: 1 });
productSchema.index({ createdAt: -1 }); // Sắp xếp theo ngày tạo mới nhất

/**
 * Tạo model Product từ schema
 * Model này sẽ được sử dụng để tương tác với collection "products" trong MongoDB
 */
const Product = mongoose.model("Product", productSchema);

export default Product;
