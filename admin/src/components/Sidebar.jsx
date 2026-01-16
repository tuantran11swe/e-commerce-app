import { NavLink } from "react-router-dom";
import { assets } from "../assets/admin_assets/assets";

/**
 * Component Sidebar - Thanh điều hướng bên trái của admin panel
 * Hiển thị các menu điều hướng đến các trang quản lý khác nhau
 */
const Sidebar = () => {
  return (
    <div className="border-r-2 w-[18%] min-h-screen">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        {/* Link điều hướng đến trang thêm sản phẩm */}
        <NavLink
          className={`flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l`}
          to="/add"
        >
          <img alt="Thêm sản phẩm" className="w-5 h-5" src={assets.add_icon} />
          <p className="hidden md:block">Thêm Sản Phẩm</p>
        </NavLink>
        {/* Link điều hướng đến trang danh sách sản phẩm */}
        <NavLink
          className={`flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l`}
          to="/list"
        >
          <img
            alt="Danh sách sản phẩm"
            className="w-5 h-5"
            src={assets.order_icon}
          />
          <p className="hidden md:block">Danh Sách Sản Phẩm</p>
        </NavLink>
        {/* Link điều hướng đến trang quản lý đơn hàng */}
        <NavLink
          className={`flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l`}
          to="/orders"
        >
          <img alt="Đơn hàng" className="w-5 h-5" src={assets.order_icon} />
          <p className="hidden md:block">Đơn Hàng</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
