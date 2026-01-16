import { useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets.js";
import { backendURL } from "../config/constants.js";

/**
 * Component trang thêm sản phẩm mới
 * Cho phép admin upload ảnh, nhập thông tin và thêm sản phẩm vào hệ thống
 */
const Add = ({ token }) => {
  // State quản lý các file ảnh đã chọn
  const [imageFiles, setImageFiles] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  // State quản lý preview URL của các ảnh
  const [imagePreviews, setImagePreviews] = useState({
    image1: assets.upload_area,
    image2: assets.upload_area,
    image3: assets.upload_area,
    image4: assets.upload_area,
  });

  // State quản lý các kích thước đã chọn
  const [selectedSizes, setSelectedSizes] = useState([]);

  // State quản lý trạng thái bestseller
  const [isBestseller, setIsBestseller] = useState(false);

  // State quản lý trạng thái đang submit form
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State quản lý giá sản phẩm
  const [price, setPrice] = useState("");

  /**
   * Hàm format giá theo định dạng Việt Nam (dấu chấm phân cách hàng nghìn)
   * Ví dụ: 150000 -> "150.000 ₫"
   * @param {number|string} priceValue - Giá trị giá cần format
   * @returns {string} - Giá đã được format
   */
  const formatPrice = (priceValue) => {
    if (!priceValue || priceValue === "") return "";
    // Chuyển số thành chuỗi và thêm dấu chấm phân cách hàng nghìn
    const formattedPrice = priceValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedPrice} ₫`;
  };

  /**
   * Xử lý khi người dùng thay đổi giá sản phẩm
   * @param {Event} e - Event từ input
   */
  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số
    if (value === "" || /^\d+$/.test(value)) {
      setPrice(value);
    }
  };

  /**
   * Xử lý khi người dùng chọn file ảnh
   * @param {Event} e - Event từ input file
   * @param {string} imageKey - Key của ảnh (image1, image2, image3, image4)
   */
  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng file
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      // Lưu file vào state
      setImageFiles((prev) => ({
        ...prev,
        [imageKey]: file,
      }));

      // Tạo preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [imageKey]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Xử lý khi người dùng click vào kích thước
   * Toggle trạng thái chọn/bỏ chọn kích thước
   * @param {string} size - Kích thước được chọn (S, M, L, XL, XXL)
   */
  const handleSizeClick = (size) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        // Nếu đã chọn thì bỏ chọn
        return prev.filter((s) => s !== size);
      }
      // Nếu chưa chọn thì thêm vào
      return [...prev, size];
    });
  };

  /**
   * Xử lý submit form thêm sản phẩm
   * @param {Event} e - Event submit form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Lấy dữ liệu từ form
    const formData = new FormData(e.target);

    // Kiểm tra và xử lý giá sản phẩm
    if (!price || price === "") {
      toast.error("Vui lòng nhập giá sản phẩm");
      setIsSubmitting(false);
      return;
    }

    // Đảm bảo giá được gửi đi là số nguyên
    formData.set("price", price);

    // Kiểm tra xem có ít nhất một ảnh được chọn không
    const hasImage = Object.values(imageFiles).some((file) => file !== null);
    if (!hasImage) {
      toast.error("Vui lòng chọn ít nhất một ảnh cho sản phẩm");
      setIsSubmitting(false);
      return;
    }

    // Thêm các ảnh vào FormData
    Object.entries(imageFiles).forEach(([, file]) => {
      if (file) {
        formData.append("images", file);
      }
    });

    // Thêm sizes vào FormData (chuyển array thành string phân cách bằng dấu phẩy)
    if (selectedSizes.length > 0) {
      formData.append("sizes", selectedSizes.join(","));
    }

    // Thêm bestseller vào FormData
    formData.append("bestseller", isBestseller.toString());

    // Kiểm tra token trước khi gửi request
    if (!token || token === "") {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
      setIsSubmitting(false);
      return;
    }

    try {
      // Gửi request đến API
      const response = await fetch(`${backendURL}/api/product/add`, {
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Thêm sản phẩm thành công");
        // Reset form
        e.target.reset();
        setImageFiles({
          image1: null,
          image2: null,
          image3: null,
          image4: null,
        });
        setImagePreviews({
          image1: assets.upload_area,
          image2: assets.upload_area,
          image3: assets.upload_area,
          image4: assets.upload_area,
        });
        setSelectedSizes([]);
        setIsBestseller(false);
        setPrice("");
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi thêm sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      toast.error("Không thể kết nối đến server. Vui lòng thử lại sau");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex flex-col items-start gap-3 w-full"
      onSubmit={handleSubmit}
    >
      {/* Phần upload ảnh */}
      <div>
        <p className="mb-2">Tải ảnh lên</p>
        <div className="flex gap-2">
          {/* Ảnh 1 */}
          <label className="cursor-pointer" htmlFor="image1">
            <img
              alt="Khu vực tải ảnh 1"
              className="border border-gray-300 hover:border-gray-400 rounded w-20 h-20 object-cover transition-colors cursor-pointer"
              src={imagePreviews.image1}
            />
            <input
              accept="image/*"
              hidden
              id="image1"
              onChange={(e) => handleImageChange(e, "image1")}
              type="file"
            />
          </label>

          {/* Ảnh 2 */}
          <label className="cursor-pointer" htmlFor="image2">
            <img
              alt="Khu vực tải ảnh 2"
              className="border border-gray-300 hover:border-gray-400 rounded w-20 h-20 object-cover transition-colors cursor-pointer"
              src={imagePreviews.image2}
            />
            <input
              accept="image/*"
              hidden
              id="image2"
              onChange={(e) => handleImageChange(e, "image2")}
              type="file"
            />
          </label>

          {/* Ảnh 3 */}
          <label className="cursor-pointer" htmlFor="image3">
            <img
              alt="Khu vực tải ảnh 3"
              className="border border-gray-300 hover:border-gray-400 rounded w-20 h-20 object-cover transition-colors cursor-pointer"
              src={imagePreviews.image3}
            />
            <input
              accept="image/*"
              hidden
              id="image3"
              onChange={(e) => handleImageChange(e, "image3")}
              type="file"
            />
          </label>

          {/* Ảnh 4 */}
          <label className="cursor-pointer" htmlFor="image4">
            <img
              alt="Khu vực tải ảnh 4"
              className="border border-gray-300 hover:border-gray-400 rounded w-20 h-20 object-cover transition-colors cursor-pointer"
              src={imagePreviews.image4}
            />
            <input
              accept="image/*"
              hidden
              id="image4"
              onChange={(e) => handleImageChange(e, "image4")}
              type="file"
            />
          </label>
        </div>
      </div>

      {/* Tên sản phẩm */}
      <div className="w-full">
        <p className="mb-2">Tên sản phẩm</p>
        <input
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 w-full max-w-[500px]"
          name="name"
          placeholder="Nhập tên sản phẩm"
          required
          type="text"
        />
      </div>

      {/* Mô tả sản phẩm */}
      <div className="w-full">
        <p className="mb-2">Mô tả sản phẩm</p>
        <textarea
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 w-full max-w-[500px] min-h-[100px] resize-y"
          name="description"
          placeholder="Nhập mô tả sản phẩm"
          required
        />
      </div>

      {/* Category, Sub category và Price */}
      <div className="flex sm:flex-row flex-col gap-2 sm:gap-8 w-full">
        {/* Category */}
        <div>
          <p className="mb-2">Danh mục sản phẩm</p>
          <select
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 w-full"
            name="category"
            required
          >
            <option value="">Chọn danh mục</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Trẻ em">Trẻ em</option>
          </select>
        </div>

        {/* Sub category */}
        <div>
          <p className="mb-2">Danh mục con</p>
          <select
            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 w-full"
            name="subcategory"
          >
            <option value="">Chọn danh mục con</option>
            <option value="Áo">Áo</option>
            <option value="Quần">Quần</option>
            <option value="Đồ mùa đông">Đồ mùa đông</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <p className="mb-2">Giá sản phẩm</p>
          <div className="flex items-center gap-2">
            <input
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 w-full sm:w-[120px]"
              min="0"
              name="price"
              onChange={handlePriceChange}
              placeholder="150000"
              required
              type="text"
              value={price}
            />
            {price && (
              <span className="font-medium text-gray-600 text-sm">
                {formatPrice(price)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Kích thước sản phẩm */}
      <div>
        <p className="mb-2">Kích thước sản phẩm</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size}>
              <button
                className={`px-3 py-1 cursor-pointer transition-colors ${
                  selectedSizes.includes(size)
                    ? "bg-gray-400 text-white"
                    : "bg-slate-200 hover:bg-slate-300"
                }`}
                onClick={() => handleSizeClick(size)}
                type="button"
              >
                {size}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Checkbox bestseller */}
      <div className="flex gap-2 mt-2">
        <input
          checked={isBestseller}
          id="bestseller"
          onChange={(e) => setIsBestseller(e.target.checked)}
          type="checkbox"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Thêm vào sản phẩm bán chạy
        </label>
      </div>

      {/* Nút submit */}
      <button
        className="bg-black hover:bg-gray-800 disabled:bg-gray-400 mt-4 py-3 rounded w-28 text-white transition-colors disabled:cursor-not-allowed"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Đang thêm..." : "THÊM"}
      </button>
    </form>
  );
};

export default Add;
