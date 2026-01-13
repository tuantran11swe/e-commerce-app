import { useContext } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

// Component trang hiển thị danh sách đơn hàng của người dùng
// Hiển thị thông tin các sản phẩm đã đặt hàng với trạng thái và nút theo dõi
const Orders = () => {
  // Lấy danh sách sản phẩm và hàm format giá từ context
  const { products, formatPrice } = useContext(ShopContext);

  // Hàm chuyển đổi timestamp thành định dạng ngày tháng tiếng Việt
  // date: timestamp (milliseconds)
  // Trả về: chuỗi ngày tháng định dạng dd/mm/yyyy
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="pt-16 border-t">
      {/* Tiêu đề trang */}
      <div className="text-2xl">
        <Title text1={"ĐƠN"} text2={"HÀNG CỦA TÔI"} />
      </div>

      {/* Danh sách đơn hàng */}
      <div>
        {/* Hiển thị 3 sản phẩm đầu tiên (từ index 1 đến 3) */}
        {products.slice(1, 4).map((item) => (
          <div
            className="flex md:flex-row flex-col md:justify-between md:items-center gap-4 py-4 border-t border-b text-gray-700"
            key={item._id}
          >
            {/* Phần thông tin sản phẩm bên trái */}
            <div className="flex items-start gap-6 text-sm">
              {/* Hình ảnh sản phẩm */}
              <img
                alt={item.name}
                className="w-16 sm:w-20"
                src={item.image[0]}
              />
              <div>
                {/* Tên sản phẩm */}
                <p className="font-medium sm:text-base">{item.name}</p>
                {/* Thông tin giá, số lượng và kích thước */}
                <div className="flex items-center gap-3 mt-2 text-gray-700 text-base">
                  {/* Giá sản phẩm - format theo định dạng Việt Nam */}
                  <p className="text-lg">{formatPrice(item.price)}</p>
                  {/* Số lượng sản phẩm */}
                  <p>Số lượng: 1</p>
                  {/* Kích thước sản phẩm */}
                  <p>Kích thước: M</p>
                </div>
                {/* Ngày đặt hàng */}
                <p className="mt-2">
                  Ngày:{" "}
                  <span className="text-gray-400">{formatDate(item.date)}</span>
                </p>
              </div>
            </div>

            {/* Phần trạng thái và hành động bên phải */}
            <div className="flex justify-between md:w-1/2">
              {/* Trạng thái đơn hàng */}
              <div className="flex items-center gap-2">
                {/* Chấm tròn màu xanh biểu thị trạng thái */}
                <p className="bg-green-500 rounded-full min-w-2 h-2"></p>
                {/* Text trạng thái */}
                <p className="text-sm md:text-base">Sẵn sàng giao hàng</p>
              </div>
              {/* Nút theo dõi đơn hàng */}
              <button
                className="px-4 py-2 border rounded-sm font-medium text-sm"
                type="button"
              >
                Theo dõi đơn hàng
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
