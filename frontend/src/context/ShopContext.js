import { createContext } from "react";

// Tạo context để chia sẻ dữ liệu shop giữa các component trong ứng dụng
// Context này giúp tránh prop drilling và quản lý state tập trung
export const ShopContext = createContext();
