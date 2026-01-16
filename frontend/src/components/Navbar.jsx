import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";

// Component Navbar - Thanh điều hướng chính của ứng dụng
const Navbar = () => {
  // State quản lý trạng thái hiển thị menu mobile (ẩn/hiện)
  const [visible, setVisible] = useState(false);

  // Lấy dữ liệu và hàm từ context ShopContext
  const { setShowSearch, getCartCount, token, logout, navigate, user } =
    useContext(ShopContext);

  return (
    <div className="flex justify-between items-center py-5 font-medium">
      {/* Logo của website - click để quay về trang chủ */}
      <Link to="/">
        <img alt="" className="w-36 cursor-pointer" src={assets.logo} />
      </Link>

      {/* Menu điều hướng chính - chỉ hiển thị trên màn hình lớn (từ sm trở lên) */}
      <ul className="hidden sm:flex gap-5 text-gray-700 text-sm">
        <NavLink className="flex flex-col items-center gap-1" to="/">
          <p>TRANG CHỦ</p>
          {/* Đường gạch chân khi active - hiện tại đang ẩn */}
          <hr className="hidden bg-gray-700 border-none w-2/4 h-[1.5px]" />
        </NavLink>
        <NavLink className="flex flex-col items-center gap-1" to="/collection">
          <p>BỘ SƯU TẬP</p>
          <hr className="hidden bg-gray-700 border-none w-2/4 h-[1.5px]" />
        </NavLink>
        <NavLink className="flex flex-col items-center gap-1" to="/about">
          <p>GIỚI THIỆU</p>
          <hr className="hidden bg-gray-700 border-none w-2/4 h-[1.5px]" />
        </NavLink>
        <NavLink className="flex flex-col items-center gap-1" to="/contact">
          <p>LIÊN HỆ</p>
          <hr className="hidden bg-gray-700 border-none w-2/4 h-[1.5px]" />
        </NavLink>
      </ul>

      {/* Nhóm các icon bên phải navbar */}
      <div className="flex items-center gap-6">
        {/* Icon tìm kiếm */}
        <button
          className="bg-transparent p-0 border-none w-5 cursor-pointer"
          onClick={() => setShowSearch(true)}
          type="button"
        >
          <img alt="Tìm kiếm" className="w-5" src={assets.searchIcon} />
        </button>

        {/* Dropdown menu profile - hiển thị khi hover */}
        <div className="group relative">
          <button
            className="bg-transparent p-0 border-none w-5 cursor-pointer"
            onClick={() => (token ? null : navigate("/login"))}
            type="button"
          >
            <img alt="Profile" className="w-5" src={assets.profileIcon} />
          </button>
          {/* Menu dropdown xuất hiện khi hover vào icon profile */}
          {token && (
            <div className="hidden group-hover:block right-0 absolute pt-4 dropdown-menu">
              <div className="flex flex-col gap-2 bg-slate-100 px-5 py-3 rounded w-36 text-gray-500">
                <button
                  className="bg-transparent p-0 border-none text-gray-500 hover:text-black text-left cursor-pointer"
                  type="button"
                >
                  {user ? `Chào, ${user.name.split(" ")[0]}` : "Hồ sơ của tôi"}
                </button>
                <button
                  className="bg-transparent p-0 border-none text-gray-500 hover:text-black text-left cursor-pointer"
                  onClick={() => navigate("/orders")}
                  type="button"
                >
                  Đơn hàng
                </button>
                <button
                  className="bg-transparent p-0 border-none text-gray-500 hover:text-black text-left cursor-pointer"
                  onClick={logout}
                  type="button"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Icon giỏ hàng với badge hiển thị số lượng sản phẩm */}
        <Link className="relative" to="/cart">
          <img alt="" className="w-5 min-w-5" src={assets.cartIcon} />
          {/* Badge số lượng sản phẩm trong giỏ hàng - hiển thị ở dưới icon */}
          <p className="right-[-5px] bottom-[-5px] absolute flex justify-center items-center bg-black rounded-full w-4 aspect-square text-[8px] text-white text-center leading-4">
            {getCartCount()}
          </p>
        </Link>

        {/* Icon menu mobile - chỉ hiển thị trên màn hình nhỏ (dưới sm) */}
        <button
          className="sm:hidden bg-transparent p-0 border-none w-5 cursor-pointer"
          onClick={() => setVisible(true)}
          type="button"
        >
          <img alt="Menu" className="w-5" src={assets.menuIcon} />
        </button>
      </div>

      {/* Menu mobile slide-in từ bên phải */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          {/* Nút quay lại - đóng menu mobile */}
          <button
            className="flex items-center gap-4 bg-transparent p-3 border-none text-gray-600 cursor-pointer"
            onClick={() => setVisible(false)}
            type="button"
          >
            <img alt="" className="h-4 rotate-180" src={assets.dropdownIcon} />
            <p>Quay lại</p>
          </button>

          {/* Các link điều hướng trong menu mobile */}
          <NavLink
            className="py-2 pl-6 border"
            onClick={() => setVisible(false)}
            to="/"
          >
            TRANG CHỦ
          </NavLink>
          <NavLink
            className="py-2 pl-6 border"
            onClick={() => setVisible(false)}
            to="/collection"
          >
            BỘ SƯU TẬP
          </NavLink>
          <NavLink
            className="py-2 pl-6 border"
            onClick={() => setVisible(false)}
            to="/about"
          >
            GIỚI THIỆU
          </NavLink>
          <NavLink
            className="py-2 pl-6 border"
            onClick={() => setVisible(false)}
            to="/contact"
          >
            LIÊN HỆ
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
