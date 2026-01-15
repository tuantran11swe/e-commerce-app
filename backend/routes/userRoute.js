import express from "express";
import {
  adminLogin,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

// Khởi tạo router
const router = express.Router();

/**
 * Route đăng ký người dùng mới
 * POST /api/user/register
 * Body: { email, password, name }
 */
router.post("/register", registerUser);

/**
 * Route đăng nhập người dùng
 * POST /api/user/login
 * Body: { email, password }
 */
router.post("/login", loginUser);

/**
 * Route đăng nhập Admin
 * POST /api/user/admin
 * Body: { email, password }
 */
router.post("/admin", adminLogin);

export default router;
