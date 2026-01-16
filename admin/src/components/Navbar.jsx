import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";

/**
 * Component Navbar - Thanh điều hướng trên cùng của admin panel
 * @param {Function} setToken - Hàm để cập nhật token (dùng để đăng xuất)
 */
const Navbar = ({ setToken }) => {
  /**
   * Handler xử lý đăng xuất
   * Xóa token và hiển thị thông báo
   */
  const logout = () => {
    setToken("");
    toast.success("Đăng xuất thành công");
  };

  return (
    <div className="flex justify-between items-center px-[4%] py-2">
      {/* Logo có thể click để về trang chủ */}
      <Link to="/">
        <img
          alt="Logo"
          className="w-[max(10%,80px)] cursor-pointer"
          src={assets.logo}
        />
      </Link>
      {/* Nút đăng xuất: xóa token để đăng xuất */}
      <button
        className="bg-gray-600 px-5 sm:px-7 py-2 sm:py-2 rounded-md text-white text-xs sm:text-sm"
        onClick={logout}
        type="button"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Navbar;
