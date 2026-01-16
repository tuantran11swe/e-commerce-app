import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Add from "./pages/Add.jsx";
import List from "./pages/List.jsx";
import Login from "./pages/Login.jsx";
import Orders from "./pages/Orders.jsx";

/**
 * Component chính của ứng dụng Admin
 * Quản lý authentication và routing cho admin panel
 */
function App() {
  // State lưu trữ token xác thực, lấy từ localStorage hoặc chuỗi rỗng
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Effect để đồng bộ token vào localStorage mỗi khi token thay đổi
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Container hiển thị thông báo toast */}
      <ToastContainer />
      {/* Kiểm tra token: nếu chưa có token thì hiển thị trang đăng nhập, ngược lại hiển thị dashboard */}
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div>
          {/* Thanh điều hướng trên cùng */}
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            {/* Sidebar điều hướng bên trái */}
            <Sidebar />
            {/* Khu vực nội dung chính bên phải */}
            <div className="mx-auto my-8 ml-[max(5vw,25px)] w-[70%] text-gray-600 text-base">
              {/* Định tuyến các trang */}
              <Routes>
                {/* Route mặc định: chuyển hướng đến trang thêm sản phẩm */}
                <Route element={<Navigate to="/add" />} path="/" />
                {/* Trang thêm sản phẩm mới */}
                <Route element={<Add token={token} />} path="/add" />
                {/* Trang danh sách sản phẩm */}
                <Route element={<List token={token} />} path="/list" />
                {/* Trang quản lý đơn hàng */}
                <Route element={<Orders token={token} />} path="/orders" />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
