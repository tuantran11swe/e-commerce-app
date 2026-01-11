import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

// Component trang giỏ hàng
const Cart = () => {
  const { formatPrice, products, cartItems, updateQuantity } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  // Chuyển đổi cartItems từ object sang mảng để render
  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            quantity: cartItems[items][item],
            size: item,
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (itemId, size, productName) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa "${productName}" (Size: ${size}) khỏi giỏ hàng?`,
    );
    if (confirmed) {
      updateQuantity(itemId, size, 0);
      toast.success(`${productName} đã được xóa khỏi giỏ hàng!`);
    }
  };

  return (
    <div className="pt-14 border-t">
      <div className="mb-3 text-2xl">
        <Title text1={"GIỎ"} text2={"HÀNG"} />
      </div>
      <div>
        {cartData.map((item) => {
          const productData = products.find(
            (product) => product._id === item._id,
          );
          return (
            <div
              className="items-center gap-4 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] py-4 border-t border-b text-gray-700"
              key={`${item._id}-${item.size}`}
            >
              <div className="flex items-start gap-6">
                <img
                  alt={`Hình ảnh ${productData.name}`}
                  className="w-16 sm:w-20"
                  src={productData.image[0]}
                />
                <div>
                  <p className="font-medium text-xs sm:text-lg">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>{formatPrice(productData.price)}</p>
                    <p className="bg-slate-50 px-2 sm:px-3 sm:py-1 border">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                className="px-1 sm:px-2 py-1 border max-w-10 sm:max-w-20"
                defaultValue={item.quantity}
                min={1}
                onChange={(e) =>
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
                <img
                  alt="Xóa"
                  className="w-full h-full"
                  src={assets.bin_icon}
                />
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
        </div>
      </div>
    </div>
  );
};

export default Cart;
