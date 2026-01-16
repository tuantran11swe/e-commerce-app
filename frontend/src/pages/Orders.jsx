import { useCallback, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import Title from "../components/Title";
import { API_ENDPOINTS } from "../config/config";
import { ShopContext } from "../context/ShopContext";

// Component trang hiển thị danh sách đơn hàng của người dùng
const Orders = () => {
  const { formatPrice, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Hàm fetch dữ liệu đơn hàng từ backend
   * Sắp xếp đơn hàng theo thứ tự mới nhất (createdAt DESC)
   * Khi Admin thay đổi trạng thái, reload trang sẽ hiển thị trạng thái mới
   */
  const loadOrderData = useCallback(async () => {
    try {
      if (!token) return;
      setLoading(true);
      const response = await axiosInstance.get(API_ENDPOINTS.ORDER.USER_ORDERS);
      if (response.data.success) {
        const allOrdersItem = [];
        // Sắp xếp đơn hàng theo thứ tự mới nhất trước khi xử lý items
        const sortedOrders = [...(response.data.data.orders || [])].sort(
          (a, b) => {
            const dateA = new Date(a.createdAt || a.date || 0);
            const dateB = new Date(b.createdAt || b.date || 0);
            return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
          },
        );

        sortedOrders.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date || order.createdAt;
            item.orderId = order._id;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    return `${dateObj.getDate().toString().padStart(2, "0")}/${(
      dateObj.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${dateObj.getFullYear()}`;
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (orderData.length === 0) {
    return (
      <EmptyState
        btnLink="/collection"
        btnText="BẮT ĐẦU MUA SẮM"
        message="Hãy bắt đầu mua sắm để có những đơn hàng tuyệt vời nhé!"
        title="Bạn chưa có đơn hàng nào"
      />
    );
  }

  return (
    <div className="pt-16 border-t">
      <div className="text-2xl">
        <Title text1={"ĐƠN"} text2={"HÀNG CỦA TÔI"} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            className="flex md:flex-row flex-col md:justify-between md:items-center gap-4 py-4 border-t border-b text-gray-700"
            key={`${item.orderId}-${index}`}
          >
            <div className="flex items-start gap-6 text-sm">
              {item.images && item.images.length > 0 && item.images[0] ? (
                <img
                  alt={item.name}
                  className="w-16 sm:w-20"
                  src={item.images[0]}
                />
              ) : (
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
              <div>
                <p className="font-medium sm:text-base">{item.name}</p>
                <div className="flex items-center gap-3 mt-2 text-gray-700 text-base">
                  <p className="text-lg">{formatPrice(item.price)}</p>
                  <p>Số lượng: {item.quantity}</p>
                  <p>Kích thước: {item.size}</p>
                </div>
                <p className="mt-2">
                  Ngày:{" "}
                  <span className="text-gray-400">{formatDate(item.date)}</span>
                </p>
                <p className="mt-2">
                  Thanh toán:{" "}
                  <span className="text-gray-400 uppercase">
                    {item.paymentMethod}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-between md:w-1/2">
              <div className="flex items-center gap-2">
                <p
                  className={`rounded-full min-w-2 h-2 ${
                    item.status === "Delivered"
                      ? "bg-green-500"
                      : "bg-orange-400"
                  }`}
                ></p>
                <p className="text-sm md:text-base capitalize">{item.status}</p>
              </div>
              <button
                className="hover:bg-gray-50 px-4 py-2 border rounded-sm font-medium text-sm transition-all"
                onClick={loadOrderData}
                type="button"
              >
                Làm mới
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
