import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectMongoDB } from "./config/mongodb.js";
import "./config/cloudinary.js";
import { seedProducts } from "./config/seedProducts.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";

// Load các biến môi trường từ file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Lấy PORT từ biến môi trường, mặc định là 4000 nếu không có
const PORT = process.env.PORT || 4000;

// Middleware: Cho phép server đọc dữ liệu JSON từ client gửi lên
app.use(express.json());

// Middleware: Cho phép kết nối với các địa chỉ Front-end khác nhau
app.use(cors());

// Route kiểm tra server đang chạy
app.get("/", (_req, res) => {
  res.json({
    message: "Server đang chạy thành công!",
    status: "OK",
  });
});

// Mount user routes tại đường dẫn /api/user
app.use("/api/user", userRoute);

// Mount product routes tại đường dẫn /api/product
app.use("/api/product", productRoute);

// Khởi động server và lắng nghe trên PORT đã cấu hình
app.listen(PORT, async () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
  // Kết nối đến MongoDB khi server khởi động
  await connectMongoDB();
  // Kiểm tra và seed dữ liệu sản phẩm nếu cần
  await seedProducts();
});
