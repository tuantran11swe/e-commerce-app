import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets.js";
import { backendURL } from "../config/constants.js";

/**
 * Component trang quản lý đơn hàng
 * Hiển thị tất cả đơn hàng từ tất cả người dùng và cho phép cập nhật trạng thái đơn hàng
 * Đơn hàng được sắp xếp theo thứ tự mới nhất (createdAt DESC)
 */
const Orders = ({ token }) => {
  // State lưu trữ danh sách đơn hàng
  const [orders, setOrders] = useState([]);

  // State quản lý trạng thái đang tải dữ liệu
  const [isLoading, setIsLoading] = useState(true);

  // State quản lý đơn hàng đang được mở rộng để xem chi tiết
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Danh sách các trạng thái đơn hàng có thể chọn (tiếng Việt)
  const orderStatuses = [
    "Đã đặt hàng",
    "Đang đóng gói",
    "Đã gửi hàng",
    "Đang giao hàng",
    "Đã giao hàng",
  ];

  /**
   * Hàm chuyển đổi trạng thái từ tiếng Anh sang tiếng Việt
   * Để tương thích với các đơn hàng cũ có thể có status bằng tiếng Anh
   * @param {string} status - Trạng thái cần chuyển đổi
   * @returns {string} - Trạng thái đã chuyển đổi sang tiếng Việt
   */
  const translateStatus = (status) => {
    const statusMap = {
      Delivered: "Đã giao hàng",
      "Order Placed": "Đã đặt hàng",
      "Out for delivery": "Đang giao hàng",
      Packing: "Đang đóng gói",
      Shipped: "Đã gửi hàng",
      "Đang xử lý": "Đã đặt hàng", // Map status mặc định của backend
    };
    return statusMap[status] || status || "Đã đặt hàng";
  };

  /**
   * Hàm chuyển đổi trạng thái từ tiếng Việt sang tiếng Anh (nếu cần)
   * Hoặc giữ nguyên tiếng Việt để gửi lên server
   * @param {string} status - Trạng thái cần chuyển đổi
   * @returns {string} - Trạng thái để gửi lên server
   */
  const normalizeStatusForServer = (status) => {
    // Giữ nguyên tiếng Việt vì backend đã hỗ trợ tiếng Việt
    return status;
  };

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
   * Hàm format ngày tháng theo định dạng Việt Nam
   * Ví dụ: "2024-01-15T10:30:00.000Z" -> "15/01/2024 10:30"
   * @param {string} dateString - Chuỗi ngày tháng cần format
   * @returns {string} - Ngày tháng đã được format
   */
  const _formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  /**
   * Hàm lấy danh sách đơn hàng từ API
   * Sắp xếp đơn hàng theo thứ tự mới nhất (createdAt DESC)
   */
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${backendURL}/api/order/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.success) {
        const ordersList = data.data.orders || [];
        // Sắp xếp đơn hàng theo thứ tự mới nhất (createdAt DESC)
        const sortedOrders = [...ordersList].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date || 0);
          const dateB = new Date(b.createdAt || b.date || 0);
          return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
        });
        setOrders(sortedOrders);
      } else {
        toast.error(data.message || "Không thể tải danh sách đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      toast.error("Không thể kết nối đến server. Vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  /**
   * Hàm cập nhật trạng thái đơn hàng
   * Khi Admin thay đổi trạng thái, gửi API request và làm mới danh sách đơn hàng
   * @param {string} orderId - ID của đơn hàng cần cập nhật
   * @param {string} newStatus - Trạng thái mới của đơn hàng
   */
  const handleStatusChange = async (orderId, newStatus) => {
    // Kiểm tra token trước khi gửi request
    if (!token || token === "") {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
      return;
    }

    try {
      const response = await fetch(
        `${backendURL}/api/order/${orderId}/status`,
        {
          body: JSON.stringify({ status: newStatus }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "PUT",
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          data.message || "Cập nhật trạng thái đơn hàng thành công",
        );
        // Làm mới danh sách đơn hàng sau khi cập nhật để hiển thị trạng thái mới
        // Danh sách sẽ được sắp xếp lại theo thứ tự mới nhất
        await fetchOrders();
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      toast.error("Không thể kết nối đến server. Vui lòng thử lại sau");
    }
  };

  /**
   * Hàm toggle hiển thị chi tiết đơn hàng
   * @param {string} orderId - ID của đơn hàng cần toggle
   */
  const _toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  // Effect để fetch danh sách đơn hàng khi component mount
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [fetchOrders, token]);

  // Hiển thị loading state
  if (isLoading) {
    return (
      <div className="mx-auto my-8 ml-[max(5vw,25px)] w-[70%] text-gray-600 text-base">
        <p className="mb-2">Đang tải danh sách đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h3 className="mb-5 text-gray-600 text-lg">Trang Đơn Hàng</h3>

      {/* Danh sách đơn hàng */}
      {orders.length === 0 ? (
        <div className="py-8 text-gray-500 text-center">
          {isLoading
            ? "Đang tải danh sách đơn hàng..."
            : "Không có đơn hàng nào trong hệ thống"}
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              className="items-start gap-3 grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] my-3 md:my-4 p-5 md:p-8 border-2 border-gray-200 text-gray-700 text-xs sm:text-sm"
              key={order._id}
            >
              {/* Icon hộp vuông bên trái */}
              <img
                alt="Biểu tượng đơn hàng"
                className="w-12"
                src={assets.parcel_icon}
              />

              {/* Thông tin sản phẩm và địa chỉ */}
              <div>
                {/* Danh sách sản phẩm */}
                <div>
                  {(order.items || order.products || []).map((item, index) => (
                    <p
                      className="py-0.5"
                      key={item._id || item.productId || index}
                    >
                      {item.productId?.name || item.name || "Không có"} x{" "}
                      {item.quantity || 1} <span> {item.size || "M"} </span>
                    </p>
                  ))}
                </div>

                {/* Tên khách hàng */}
                <p className="mt-3 mb-2 font-medium">
                  {(() => {
                    // Ưu tiên lấy từ shippingAddress, sau đó từ address object, cuối cùng từ userId
                    const firstName =
                      order.shippingAddress?.firstName ||
                      (typeof order.address === "object" &&
                      order.address !== null
                        ? order.address.firstName
                        : null);
                    const lastName =
                      order.shippingAddress?.lastName ||
                      (typeof order.address === "object" &&
                      order.address !== null
                        ? order.address.lastName
                        : null);

                    if (firstName && lastName) {
                      return `${firstName} ${lastName}`;
                    }

                    // Fallback về tên từ userId hoặc userName
                    return order.userId?.name || order.userName || "Khách hàng";
                  })()}
                </p>

                {/* Địa chỉ */}
                <div>
                  <p>
                    {(() => {
                      // Lấy địa chỉ đường phố từ shippingAddress hoặc address object
                      const street =
                        order.shippingAddress?.street ||
                        order.shippingAddress?.address ||
                        (typeof order.address === "object" &&
                        order.address !== null
                          ? order.address.street || order.address.address
                          : typeof order.address === "string"
                            ? order.address
                            : null) ||
                        "Không có";
                      return street;
                    })()},
                  </p>
                  <p>
                    {(() => {
                      // Lấy thông tin thành phố, tỉnh/thành phố, quốc gia và mã bưu điện
                      const city =
                        order.shippingAddress?.city ||
                        (typeof order.address === "object" &&
                        order.address !== null
                          ? order.address.city
                          : null) ||
                        "";
                      const state =
                        order.shippingAddress?.state ||
                        (typeof order.address === "object" &&
                        order.address !== null
                          ? order.address.state
                          : null) ||
                        "";
                      const country =
                        order.shippingAddress?.country ||
                        (typeof order.address === "object" &&
                        order.address !== null
                          ? order.address.country
                          : null) ||
                        "US";
                      const zipcode =
                        order.shippingAddress?.zipcode ||
                        order.shippingAddress?.zipCode ||
                        (typeof order.address === "object" &&
                        order.address !== null
                          ? order.address.zipcode || order.address.zipCode
                          : null) ||
                        "";

                      return `${city ? `${city}, ` : ""}${
                        state ? `${state}, ` : ""
                      }${country}${zipcode ? `, ${zipcode}` : ""}`;
                    })()}
                  </p>
                </div>

                {/* Số điện thoại */}
                <p className="mt-1">
                  {String(
                    order.shippingAddress?.phone ||
                      (typeof order.address === "object" &&
                      order.address !== null
                        ? order.address.phone
                        : null) ||
                      order.userId?.phone ||
                      order.userPhone ||
                      "Không có",
                  )}
                </p>
              </div>

              {/* Thông tin Sản phẩm, Phương thức, Thanh toán, Ngày */}
              <div>
                <p className="sm:text-[15px] text-sm">
                  Sản phẩm :{" "}
                  {(order.items || order.products || []).reduce(
                    (total, item) => total + (item.quantity || 1),
                    0,
                  )}
                </p>
                <p className="mt-3">
                  Phương thức : {order.paymentMethod || order.payment || "COD"}
                </p>
                <p>Thanh toán : {order.paymentStatus || "Chờ xử lý"}</p>
                <p>
                  Ngày :{" "}
                  {new Date(order.createdAt || order.date).toLocaleDateString(
                    "vi-VN",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>

              {/* Giá tiền */}
              <p className="sm:text-[15px] text-sm">
                {formatPrice(order.amount || 0)}
              </p>

              {/* Dropdown trạng thái */}
              <select
                className="p-2 font-semibold"
                onChange={(e) =>
                  handleStatusChange(
                    order._id,
                    normalizeStatusForServer(e.target.value),
                  )
                }
                value={translateStatus(order.status) || "Đã đặt hàng"}
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
