import { useContext, useMemo } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

// Component trang giỏ hàng - hiển thị danh sách sản phẩm đã thêm vào giỏ và cho phép cập nhật/xóa
const Cart = () => {
  // Lấy các giá trị và hàm cần thiết từ ShopContext
  const {
    formatPrice,
    products,
    cartItems,
    updateQuantity,
    navigate,
    loading,
  } = useContext(ShopContext);

  // Chuyển đổi cartItems từ object sang mảng để dễ dàng render
  // cartItems có cấu trúc: { itemId: { size: quantity } }
  // Chuyển thành mảng: [{ _id, quantity, size }]
  // Sử dụng useMemo để tính toán lại chỉ khi cartItems thay đổi
  const cartData = useMemo(() => {
    const tempData = [];
    // Duyệt qua từng sản phẩm trong giỏ hàng
    for (const items in cartItems) {
      // Duyệt qua từng size của sản phẩm
      for (const item in cartItems[items]) {
        // Chỉ thêm các sản phẩm có số lượng > 0
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items, // ID sản phẩm
            quantity: cartItems[items][item], // Số lượng
            size: item, // Kích thước
          });
        }
      }
    }
    return tempData;
  }, [cartItems]); // Tính toán lại khi cartItems thay đổi

  // Xóa sản phẩm khỏi giỏ hàng
  // Hiển thị hộp thoại xác nhận trước khi xóa sản phẩm
  const handleRemoveItem = (itemId, size, productName) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa "${productName}" (Size: ${size}) khỏi giỏ hàng?`,
    );
    if (confirmed) {
      // Đặt số lượng về 0 để xóa sản phẩm
      updateQuantity(itemId, size, 0);
      toast.success(`${productName} đã được xóa khỏi giỏ hàng!`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="border-4 border-gray-200 border-t-gray-800 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-14 border-t">
      <div className="mb-3 text-2xl">
        <Title text1={"GIỎ"} text2={"HÀNG"} />
      </div>
      {/* Danh sách sản phẩm trong giỏ hàng */}
      <div>
        {cartData.map((item) => {
          // Tìm thông tin chi tiết của sản phẩm từ danh sách products
          const productData = products.find(
            (product) => product._id === item._id,
          );

          // Nếu không tìm thấy thông tin sản phẩm (có thể do đang load hoặc id không tồn tại)
          if (!productData) {
            return null;
          }

          return (
            // Mỗi item trong giỏ hàng hiển thị: hình ảnh + thông tin, input số lượng, nút xóa
            <div
              className="items-center gap-4 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] py-4 border-t border-b text-gray-700"
              key={`${item._id}-${item.size}`}
            >
              {/* Phần hiển thị hình ảnh và thông tin sản phẩm */}
              <div className="flex items-start gap-6">
                {/* Hình ảnh sản phẩm */}
                <img
                  alt={`Hình ảnh ${productData.name}`}
                  className="w-16 sm:w-20"
                  src={
                    productData.images && productData.images.length > 0
                      ? productData.images[0]
                      : ""
                  }
                />
                {/* Tên sản phẩm, giá và size */}
                <div>
                  <p className="font-medium text-xs sm:text-lg">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    {/* Giá sản phẩm đã được format */}
                    <p>{formatPrice(productData.price)}</p>
                    {/* Badge hiển thị size */}
                    <p className="bg-slate-50 px-2 sm:px-3 sm:py-1 border">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              {/* Input để cập nhật số lượng sản phẩm */}
              <input
                className="px-1 sm:px-2 py-1 border max-w-10 sm:max-w-20"
                defaultValue={item.quantity}
                min={1}
                onChange={(e) =>
                  // Chỉ cập nhật khi giá trị hợp lệ (không rỗng và không phải 0)
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value),
                      )
                }
                type="number"
              />
              <button
                aria-label="Xóa sản phẩm khỏi giỏ hàng"
                className="bg-transparent mr-4 p-0 border-none w-4 sm:w-5 cursor-pointer"
                onClick={() =>
                  handleRemoveItem(item._id, item.size, productData.name)
                }
                type="button"
              >
                <img alt="Xóa" className="w-full h-full" src={assets.binIcon} />
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            {/* Nút chuyển đến trang đặt hàng */}
            <button
              className="bg-black my-8 px-8 py-3 text-white text-sm"
              onClick={() => navigate("/place-order")}
              type="button"
            >
              TIẾN HÀNH THANH TOÁN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
