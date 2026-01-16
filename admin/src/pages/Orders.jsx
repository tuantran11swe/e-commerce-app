import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
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

  // Danh sách các trạng thái đơn hàng có thể chọn
  const orderStatuses = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];

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
  const formatDate = (dateString) => {
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
      const response = await fetch(`${backendURL}/api/orders/list`, {
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
        `${backendURL}/api/orders/${orderId}/status`,
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
  const toggleOrderDetails = (orderId) => {
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
    <div>
      <p className="mb-2">
        Danh sách tất cả đơn hàng (sắp xếp theo thứ tự mới nhất)
      </p>
      <div className="flex flex-col gap-2">
        {/* Header của bảng - chỉ hiển thị trên màn hình lớn */}
        <div className="hidden items-center md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] bg-gray-100 px-2 py-1 border text-sm">
          <b>Mã đơn hàng</b>
          <b>Khách hàng</b>
          <b>Ngày đặt</b>
          <b>Tổng tiền</b>
          <b>Trạng thái</b>
          <b className="text-center">Thao tác</b>
        </div>

        {/* Danh sách đơn hàng */}
        {orders.length === 0 ? (
          <div className="py-8 text-gray-500 text-center">
            Không có đơn hàng nào trong hệ thống
          </div>
        ) : (
          orders.map((order) => (
            <div
              className="flex flex-col border border-gray-300 rounded"
              key={order._id}
            >
              {/* Thông tin chính của đơn hàng */}
              <div className="items-center gap-2 grid grid-cols-[1fr_2fr] md:grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] px-2 py-3 text-sm">
                {/* Mã đơn hàng */}
                <div>
                  <p className="font-medium">
                    #{order._id?.slice(-8) || "N/A"}
                  </p>
                </div>

                {/* Thông tin khách hàng */}
                <div>
                  <p className="font-medium">
                    {order.userId?.name || order.userName || "Khách hàng"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {order.userId?.email || order.userEmail || ""}
                  </p>
                </div>

                {/* Ngày đặt hàng - chỉ hiển thị trên màn hình lớn */}
                <div className="hidden md:block">
                  <p>{formatDate(order.createdAt || order.date)}</p>
                </div>

                {/* Tổng tiền - chỉ hiển thị trên màn hình lớn */}
                <div className="hidden md:block">
                  <p className="font-medium text-green-600">
                    {formatPrice(order.totalAmount || order.total)}
                  </p>
                </div>

                {/* Trạng thái đơn hàng - chỉ hiển thị trên màn hình lớn */}
                <div className="hidden md:block">
                  <select
                    className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    value={order.status || "Order Placed"}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nút xem chi tiết */}
                <div className="flex justify-end md:justify-center items-center gap-2">
                  <button
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm transition-colors"
                    onClick={() => toggleOrderDetails(order._id)}
                    type="button"
                  >
                    {expandedOrderId === order._id ? "Ẩn" : "Chi tiết"}
                  </button>
                </div>
              </div>

              {/* Chi tiết đơn hàng - hiển thị khi được mở rộng */}
              {expandedOrderId === order._id && (
                <div className="bg-gray-50 px-4 py-3 border-gray-300 border-t">
                  {/* Thông tin khách hàng */}
                  <div className="mb-4">
                    <h3 className="mb-2 font-semibold text-base">
                      Thông tin khách hàng
                    </h3>
                    <div className="flex flex-col gap-1 text-sm">
                      <p>
                        <span className="font-medium">Tên:</span>{" "}
                        {order.userId?.name || order.userName || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {order.userId?.email || order.userEmail || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Số điện thoại:</span>{" "}
                        {order.userId?.phone ||
                          order.userPhone ||
                          order.shippingAddress?.phone ||
                          "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Địa chỉ:</span>{" "}
                        {order.shippingAddress?.address ||
                          order.address ||
                          "N/A"}
                      </p>
                      {order.shippingAddress?.city && (
                        <p>
                          <span className="font-medium">Thành phố:</span>{" "}
                          {order.shippingAddress.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Danh sách sản phẩm */}
                  <div className="mb-4">
                    <h3 className="mb-2 font-semibold text-base">
                      Danh sách sản phẩm
                    </h3>
                    <div className="flex flex-col gap-2">
                      {(order.items || order.products || []).map(
                        (item, index) => (
                          <div
                            className="flex items-center gap-3 bg-white p-2 border border-gray-200 rounded"
                            key={item._id || item.productId || index}
                          >
                            {/* Hình ảnh sản phẩm */}
                            <img
                              alt={
                                item.productId?.name ||
                                item.name ||
                                `Sản phẩm ${index + 1}`
                              }
                              className="border border-gray-200 rounded w-16 h-16 object-cover"
                              src={
                                item.productId?.images?.[0] ||
                                item.images?.[0] ||
                                item.image ||
                                ""
                              }
                            />
                            {/* Thông tin sản phẩm */}
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {item.productId?.name || item.name || "N/A"}
                              </p>
                              <p className="text-gray-500 text-xs">
                                Số lượng: {item.quantity || 1}
                                {item.size && ` - Kích thước: ${item.size}`}
                              </p>
                              <p className="font-medium text-green-600 text-sm">
                                {formatPrice(
                                  item.price ||
                                    item.productId?.price ||
                                    item.totalPrice ||
                                    0,
                                )}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Tổng kết đơn hàng */}
                  <div className="pt-3 border-gray-300 border-t">
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Tổng tiền sản phẩm:</span>
                        <span>
                          {formatPrice(
                            order.subtotal ||
                              order.itemsTotal ||
                              order.totalAmount ||
                              order.total ||
                              0,
                          )}
                        </span>
                      </div>
                      {order.shippingFee && (
                        <div className="flex justify-between">
                          <span className="font-medium">Phí vận chuyển:</span>
                          <span>{formatPrice(order.shippingFee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-gray-300 border-t font-semibold text-base">
                        <span>Tổng cộng:</span>
                        <span className="text-green-600">
                          {formatPrice(
                            order.totalAmount ||
                              order.total ||
                              order.itemsTotal ||
                              0,
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="font-medium">
                          Phương thức thanh toán:
                        </span>
                        <span>
                          {order.paymentMethod ||
                            order.payment ||
                            "Chưa xác định"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cập nhật trạng thái - hiển thị trên màn hình nhỏ */}
                  <div className="md:hidden mt-4">
                    <label
                      className="block mb-2 font-medium text-sm"
                      htmlFor={`status-${order._id}`}
                    >
                      Trạng thái đơn hàng:
                    </label>
                    <select
                      className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 w-full"
                      id={`status-${order._id}`}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      value={order.status || "Order Placed"}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
