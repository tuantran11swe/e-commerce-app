import express from "express";
import {
  adminLogin,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/userController.js";
import { userAuth } from "../middleware/userAuth.js";

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

/**
 * Route lấy thông tin profile người dùng hiện tại
 * GET /api/user/profile
 * Headers: Authorization: Bearer <token>
 */
router.get("/profile", userAuth, getUserProfile);

/**
 * Route đăng xuất người dùng
 * POST /api/user/logout
 */
router.post("/logout", logoutUser);

export default router;
