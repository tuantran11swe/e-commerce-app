import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

// Component hiển thị tổng tiền giỏ hàng
const CartTotal = () => {
  const { delivery_fee, formatPrice, getCartAmount } = useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"GIỎ"} text2={"HÀNG"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Tổng tiền sản phẩm</p>
          <p>{formatPrice(getCartAmount())}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Phí vận chuyển</p>
          <p>{formatPrice(delivery_fee)}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Tổng cộng</p>
          <p>
            {formatPrice(
              getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee,
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
