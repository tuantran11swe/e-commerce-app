import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import ProductItem from "../components/ProductItem";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

// Component Collection - Trang hiển thị tất cả sản phẩm với chức năng lọc và sắp xếp
const Collection = () => {
  // Lấy dữ liệu từ ShopContext: danh sách sản phẩm, từ khóa tìm kiếm và trạng thái hiển thị thanh tìm kiếm
  const { products, search, showSearch } = useContext(ShopContext);

  // State quản lý hiển thị/ẩn bộ lọc trên mobile
  const [showFilters, setShowFilters] = useState(false);

  // State lưu danh sách sản phẩm sau khi áp dụng bộ lọc
  const [filterProducts, setFilterProducts] = useState([]);

  // State lưu danh sách các danh mục được chọn để lọc
  const [category, setCategory] = useState([]);

  // State lưu danh sách các loại sản phẩm được chọn để lọc
  const [subCategory, setSubCategory] = useState([]);

  // State quản lý kiểu sắp xếp: "relevant" (mặc định), "low-high" (giá thấp đến cao), "high-low" (giá cao đến thấp)
  const [sortType, setSortType] = useState("relevant");

  // Hàm xử lý toggle checkbox danh mục - thêm/xóa danh mục khỏi mảng category
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      // Nếu danh mục đã được chọn thì xóa khỏi mảng
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      // Nếu chưa được chọn thì thêm vào mảng
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Hàm xử lý toggle checkbox loại sản phẩm - thêm/xóa loại sản phẩm khỏi mảng subCategory
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      // Nếu loại sản phẩm đã được chọn thì xóa khỏi mảng
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      // Nếu chưa được chọn thì thêm vào mảng
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Effect: Áp dụng bộ lọc và sắp xếp sản phẩm khi các điều kiện thay đổi
  // Gộp logic lọc và sắp xếp vào một effect để tránh vòng lặp vô hạn
  useEffect(() => {
    // Tạo bản sao của mảng products để không thay đổi dữ liệu gốc
    let productsCopy = products.slice();

    // Lọc theo từ khóa tìm kiếm nếu có
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Lọc theo danh mục nếu có danh mục nào được chọn
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category),
      );
    }

    // Lọc theo loại sản phẩm nếu có loại nào được chọn
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory),
      );
    }

    // Sắp xếp sản phẩm theo kiểu đã chọn
    switch (sortType) {
      case "low-high":
        // Sắp xếp từ giá thấp đến cao
        productsCopy.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        // Sắp xếp từ giá cao đến thấp
        productsCopy.sort((a, b) => b.price - a.price);
        break;
      default:
        // Mặc định: không sắp xếp (giữ nguyên thứ tự)
        break;
    }

    // Cập nhật danh sách sản phẩm đã lọc và sắp xếp
    setFilterProducts(productsCopy);
  }, [products, showSearch, search, category, subCategory, sortType]);
  return (
    <div className="flex sm:flex-row flex-col gap-1 sm:gap-10 pt-10 border-t">
      {/* Sidebar chứa bộ lọc - hiển thị bên trái trên desktop, trên cùng trên mobile */}
      <div className="min-w-60">
        {/* Nút toggle hiển thị/ẩn bộ lọc trên mobile */}
        <button
          className="flex items-center gap-2 bg-transparent my-2 p-0 border-none w-full text-xl text-left cursor-pointer"
          onClick={() => setShowFilters(!showFilters)}
          type="button"
        >
          BỘ LỌC
          {/* Icon dropdown - chỉ hiển thị trên mobile, xoay khi mở */}
          <img
            alt=""
            className={`h-3 sm:hidden ${showFilters ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
          />
        </button>

        {/* Khung lọc theo danh mục */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilters ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 font-medium text-sm">DANH MỤC</p>
          <div className="flex flex-col gap-2 font-light text-gray-700 text-sm">
            <p className="flex gap-2">
              <input
                className="w-3"
                onChange={toggleCategory}
                type="checkbox"
                value="Nam"
              />{" "}
              Nam
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                onChange={toggleCategory}
                type="checkbox"
                value="Nữ"
              />{" "}
              Nữ
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                onChange={toggleCategory}
                type="checkbox"
                value="Trẻ em"
              />{" "}
              Trẻ em
            </p>
          </div>
        </div>

        {/* Khung lọc theo loại sản phẩm */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilters ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 font-medium text-sm">LOẠI SẢN PHẨM</p>
          <div className="flex flex-col gap-2 font-light text-gray-700 text-sm">
            <p className="flex gap-2">
              <input
                className="w-3"
                onChange={toggleSubCategory}
                type="checkbox"
                value="Áo"
              />{" "}
              Áo
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                onChange={toggleSubCategory}
                type="checkbox"
                value="Quần"
              />{" "}
              Quần
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                onChange={toggleSubCategory}
                type="checkbox"
                value="Đồ mùa đông"
              />{" "}
              Đồ mùa đông
            </p>
          </div>
        </div>
      </div>

      {/* Phần nội dung chính - hiển thị danh sách sản phẩm */}
      <div className="flex-1">
        {/* Header: Tiêu đề và dropdown sắp xếp */}
        <div className="flex justify-between mb-4 text-base sm:text-2xl">
          <Title text1={"TẤT CẢ"} text2={"BỘ SƯU TẬP"} />
          {/* Dropdown chọn kiểu sắp xếp */}
          <select
            className="px-2 border-2 border-gray-300 text-sm"
            id=""
            name=""
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="relevant">Sắp xếp: Mặc định</option>
            <option value="low-high">Sắp xếp: Giá thấp đến cao</option>
            <option value="high-low">Sắp xếp: Giá cao đến thấp</option>
          </select>
        </div>

        {/* Lưới hiển thị sản phẩm - responsive: 2 cột mobile, 3 cột tablet, 4 cột desktop */}
        <div className="gap-4 gap-y-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filterProducts.map((item) => (
            <ProductItem
              id={item._id}
              image={item.image}
              key={item._id}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
