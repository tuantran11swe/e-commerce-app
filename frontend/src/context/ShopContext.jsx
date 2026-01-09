import { createContext } from "react";

import { products } from "../assets/frontend_assets/assets";

// Tạo context để chia sẻ dữ liệu shop giữa các component
export const ShopContext = createContext();

// Provider component cung cấp dữ liệu cho các component con
const ShopContextProvider = (props) => {
  // Đơn vị tiền tệ sử dụng trong ứng dụng
  const currency = "₫";

  // Phí vận chuyển
  const delivery_fee = 10;

  // Object chứa tất cả giá trị cần chia sẻ qua context
  const value = { currency, delivery_fee, products };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
