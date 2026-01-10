import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";

// Component SearchBar - Thanh tìm kiếm hiển thị khi người dùng click vào icon tìm kiếm
// Chỉ hiển thị trên trang Collection để tìm kiếm sản phẩm
const SearchBar = () => {
  // Lấy các giá trị và hàm từ ShopContext để quản lý tìm kiếm
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);

  // Hook để lấy thông tin về route hiện tại
  const location = useLocation();

  // Kiểm tra xem có đang ở trang collection không
  // Component chỉ hiển thị khi đang ở trang collection
  const visible = location.pathname.includes("collection");

  // Chỉ render component khi showSearch = true và đang ở trang collection
  return showSearch && visible ? (
    <div className="bg-gray-50 border-t border-b text-center">
      {/* Khung tìm kiếm với input và icon */}
      <div className="inline-flex justify-center items-center mx-3 my-5 px-5 py-2 border border-gray-400 rounded-full w-3/4 sm:w-1/2">
        {/* Input nhập từ khóa tìm kiếm */}
        <input
          className="flex-1 bg-inherit outline-none text-sm"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm..."
          type="text"
          value={search}
        />
        {/* Icon tìm kiếm */}
        <img alt="Tìm kiếm" className="w-4" src={assets.search_icon} />
      </div>

      {/* Nút đóng thanh tìm kiếm */}
      <button
        className="inline bg-transparent p-0 border-none w-3 cursor-pointer"
        onClick={() => setShowSearch(false)}
        type="button"
      >
        <img alt="Đóng tìm kiếm" className="w-3" src={assets.cross_icon} />
      </button>
    </div>
  ) : null;
};

export default SearchBar;
