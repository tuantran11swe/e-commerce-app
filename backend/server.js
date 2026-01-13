import cors from "cors";
import dotenv from "dotenv";
import express from "express";

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

// Khởi động server và lắng nghe trên PORT đã cấu hình
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
