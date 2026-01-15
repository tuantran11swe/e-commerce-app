import mongoose from "mongoose";

/**
 * Hàm kết nối đến MongoDB sử dụng Mongoose
 * Sử dụng biến môi trường MONGODB_URI để lấy connection string
 * Nếu không có MONGODB_URI, sẽ sử dụng connection string mặc định
 */
export const connectMongoDB = async () => {
  try {
    // Lấy connection string từ biến môi trường hoặc sử dụng giá trị mặc định
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce-app";

    // Thực hiện kết nối đến MongoDB (không cần options trong Mongoose v6+)
    await mongoose.connect(mongoURI);

    // Log thông báo khi kết nối thành công
    console.log("Kết nối MongoDB thành công!");

    // Lắng nghe sự kiện khi kết nối bị lỗi
    mongoose.connection.on("error", (error) => {
      console.error("Lỗi kết nối MongoDB:", error);
    });

    // Lắng nghe sự kiện khi kết nối bị ngắt
    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB đã ngắt kết nối");
    });

    // Xử lý khi ứng dụng tắt (Ctrl+C)
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Đã đóng kết nối MongoDB");
      process.exit(0);
    });
  } catch (error) {
    // Xử lý lỗi khi kết nối thất bại
    console.error("Không thể kết nối đến MongoDB:", error.message);
    // Thoát ứng dụng nếu không thể kết nối database
    process.exit(1);
  }
};
