import { createContext, useState } from "react";

import { products } from "../assets/frontend_assets/assets";

// Tạo context để chia sẻ dữ liệu shop giữa các component trong ứng dụng
// Context này giúp tránh prop drilling và quản lý state tập trung
export const ShopContext = createContext();

// Hàm format giá theo định dạng Việt Nam (dấu chấm phân cách hàng nghìn)
// Ví dụ: 150000 -> "150.000 ₫"
const formatPrice = (price) => {
  // Chuyển số thành chuỗi và thêm dấu chấm phân cách hàng nghìn
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedPrice} ₫`;
};

// Provider component cung cấp dữ liệu và hàm xử lý cho tất cả component con
// Component này bao bọc toàn bộ ứng dụng để các component con có thể truy cập dữ liệu
const ShopContextProvider = (props) => {
  // Đơn vị tiền tệ sử dụng trong ứng dụng (đồng Việt Nam)
  const currency = "₫";

  // Phí vận chuyển mặc định (đơn vị: nghìn đồng)
  const delivery_fee = 10000;

  // State quản lý từ khóa tìm kiếm của người dùng
  const [search, setSearch] = useState("");

  // State quản lý trạng thái hiển thị/ẩn thanh tìm kiếm
  const [showSearch, setShowSearch] = useState(false);

  // Object chứa tất cả giá trị và hàm cần chia sẻ qua context
  // Các component con có thể sử dụng các giá trị này thông qua useContext hook
  const value = {
    currency, // Đơn vị tiền tệ
    delivery_fee, // Phí vận chuyển
    formatPrice, // Hàm format giá theo định dạng Việt Nam
    products, // Danh sách tất cả sản phẩm
    search, // Từ khóa tìm kiếm hiện tại
    setSearch, // Hàm cập nhật từ khóa tìm kiếm
    setShowSearch, // Hàm hiển thị/ẩn thanh tìm kiếm
    showSearch, // Trạng thái hiển thị thanh tìm kiếm
  };

  // Trả về Provider component với value chứa tất cả dữ liệu cần chia sẻ
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
