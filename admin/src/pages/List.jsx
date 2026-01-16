import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendURL } from "../config/constants.js";

/**
 * Component trang danh sách sản phẩm
 * Hiển thị tất cả sản phẩm trong hệ thống và cho phép xóa sản phẩm
 */
const List = ({ token }) => {
  // State lưu trữ danh sách sản phẩm
  const [products, setProducts] = useState([]);

  // State quản lý trạng thái đang tải dữ liệu
  const [isLoading, setIsLoading] = useState(true);

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
   * Hàm lấy danh sách sản phẩm từ API
   */
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${backendURL}/api/product/list`);
      const data = await response.json();

      if (response.ok && data.success) {
        setProducts(data.data.products || []);
      } else {
        toast.error(data.message || "Không thể tải danh sách sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      toast.error("Không thể kết nối đến server. Vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Hàm xóa sản phẩm theo ID
   * @param {string} productId - ID của sản phẩm cần xóa
   */
  const handleDeleteProduct = async (productId) => {
    // Xác nhận trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      return;
    }

    // Kiểm tra token trước khi gửi request
    if (!token || token === "") {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Xóa sản phẩm thành công");
        // Làm mới danh sách sản phẩm sau khi xóa
        await fetchProducts();
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi xóa sản phẩm");
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Không thể kết nối đến server. Vui lòng thử lại sau");
    }
  };

  // Effect để fetch danh sách sản phẩm khi component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Hiển thị loading state
  if (isLoading) {
    return (
      <div className="mx-auto my-8 ml-[max(5vw,25px)] w-[70%] text-gray-600 text-base">
        <p className="mb-2">Đang tải danh sách sản phẩm...</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2">Danh sách tất cả sản phẩm</p>
      <div className="flex flex-col gap-2">
        {/* Header của bảng - chỉ hiển thị trên màn hình lớn */}
        <div className="hidden items-center md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] bg-gray-100 px-2 py-1 border text-sm">
          <b>Hình ảnh</b>
          <b>Tên sản phẩm</b>
          <b>Danh mục</b>
          <b>Giá</b>
          <b className="text-center">Thao tác</b>
        </div>

        {/* Danh sách sản phẩm */}
        {products.length === 0 ? (
          <div className="py-8 text-gray-500 text-center">
            Không có sản phẩm nào trong hệ thống
          </div>
        ) : (
          products.map((product) => (
            <div
              className="items-center gap-2 grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] px-2 py-1 border text-sm"
              key={product._id}
            >
              {/* Hình ảnh sản phẩm */}
              <img
                alt={product.name}
                className="w-12"
                src={product.images?.[0] ? product.images[0] : ""}
              />

              {/* Tên sản phẩm */}
              <p>{product.name}</p>

              {/* Danh mục sản phẩm */}
              <p>{product.category}</p>

              {/* Giá sản phẩm - chỉ hiển thị trên màn hình lớn */}
              <p className="hidden md:block">{formatPrice(product.price)}</p>

              {/* Nút xóa sản phẩm */}
              <p
                className="hover:text-red-600 text-lg md:text-center text-right transition-colors cursor-pointer"
                onClick={() => handleDeleteProduct(product._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleDeleteProduct(product._id);
                  }
                }}
              >
                X
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
