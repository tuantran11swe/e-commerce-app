import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

/**
 * ProtectedRoute component - Bảo vệ các route yêu cầu đăng nhập
 * Nếu chưa đăng nhập, redirect về trang login và lưu lại trang hiện tại (from)
 */
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(ShopContext);
  const location = useLocation();

  if (!token) {
    // Chuyển hướng đến /login và lưu thông tin route hiện tại
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
