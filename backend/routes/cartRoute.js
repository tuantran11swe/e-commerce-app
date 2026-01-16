import express from "express";
import {
  addToCart,
  clearCart,
  getUserCart,
  syncCart,
  updateCart,
} from "../controllers/cartController.js";
import { userAuth } from "../middleware/userAuth.js";

const router = express.Router();

// Tất cả các route giỏ hàng đều yêu cầu xác thực người dùng
router.use(userAuth);

router.get("/get", getUserCart);
router.post("/add", addToCart);
router.put("/update", updateCart);
router.post("/sync", syncCart);
router.post("/clear", clearCart);

export default router;
