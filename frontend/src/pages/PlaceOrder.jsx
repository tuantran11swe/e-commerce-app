import { useContext, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

// Component trang đặt hàng - cho phép người dùng nhập thông tin giao hàng và chọn phương thức thanh toán
const PlaceOrder = () => {
  // State quản lý phương thức thanh toán được chọn (mặc định là COD - Cash on Delivery)
  const [method, setMethod] = useState("cod");
  const { navigate } = useContext(ShopContext);
  return (
    <div className="flex sm:flex-row flex-col justify-between gap-4 pt-5 sm:pt-14 border-t min-h-[80vh]">
      {/* Form nhập thông tin giao hàng */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="my-3 text-xl sm:text-2xl">
          <Title text1={"THÔNG TIN"} text2={"GIAO HÀNG"} />
        </div>
        {/* Nhập họ và tên */}
        <div className="flex gap-3">
          <input
            className="px-3.5 py-1.5 border border-gray-300 rounded w-full"
            placeholder="Họ"
            type="text"
          />
          <input
            className="px-3.5 py-1.5 border border-gray-300 rounded w-full"
            placeholder="Tên"
            type="text"
          />
        </div>
        {/* Nhập địa chỉ email */}
        <input
          className="px-3.5 py-1.5 border border-gray-300 rounded w-full"
          placeholder="Địa chỉ email"
          type="email"
        />
        {/* Nhập địa chỉ đường phố */}
        <input
          className="px-3.5 py-1.5 border border-gray-300 rounded w-full"
          placeholder="Địa chỉ đường phố"
          type="text"
        />
        {/* Nhập thành phố và tỉnh/thành phố */}
        <div className="flex gap-3">
          <input
            className="px-3.5 py-1.5 border border-gray-300 rounded w-full"
            placeholder="Thành phố"
            type="text"
          />
          <input
            className="px-3.5 py-1.5 border border-gray-300 rounded w-full"
            placeholder="Tỉnh/Thành phố"
            type="text"
          />
        </div>
        {/* Nhập mã bưu điện và quốc gia */}
        <div className="flex gap-3">
          <input
            className="px-3.5 py-1.5 border border-gray-300 rounded w-full"
            placeholder="Mã bưu điện"
            type="text"
          />
          <input
            className="px-3.5 py-1.5 border border-gray-300 rounded w-full"
            placeholder="Quốc gia"
            type="text"
          />
        </div>
        {/* Nhập số điện thoại */}
        <input
          className="px-3.5 py-1.5 border border-gray-300 rounded w-full"
          placeholder="Số điện thoại"
          type="text"
        />
      </div>
      {/* Phần tổng tiền và phương thức thanh toán */}
      <div className="mt-8">
        {/* Component hiển thị tổng tiền giỏ hàng */}
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        {/* Phần chọn phương thức thanh toán */}
        <div className="mt-12">
          <Title text1={"PHƯƠNG THỨC"} text2={"THANH TOÁN"} />
          <div className="flex lg:flex-row flex-col gap-3">
            {/* Tùy chọn thanh toán qua Stripe */}
            <button
              className="flex items-center gap-3 p-2 px-3 border cursor-pointer"
              onClick={() => setMethod("stripe")}
              type="button"
            >
              {/* Radio button hiển thị trạng thái được chọn */}
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-gray-400" : ""
                }`}
              ></p>
              <img alt="Stripe" className="mx-4 h-5" src={assets.stripeLogo} />
            </button>
            {/* Tùy chọn thanh toán qua Razorpay */}
            <button
              className="flex items-center gap-3 p-2 px-3 border cursor-pointer"
              onClick={() => setMethod("razorpay")}
              type="button"
            >
              {/* Radio button hiển thị trạng thái được chọn */}
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-gray-400" : ""
                }`}
              ></p>
              <img
                alt="Razorpay"
                className="mx-4 h-5"
                src={assets.razorpayLogo}
              />
            </button>
            {/* Tùy chọn thanh toán khi nhận hàng (COD) */}
            <button
              className="flex items-center gap-3 p-2 px-3 border cursor-pointer"
              onClick={() => setMethod("cod")}
              type="button"
            >
              {/* Radio button hiển thị trạng thái được chọn */}
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-gray-400" : ""
                }`}
              ></p>
              <p className="mx-4 font-medium text-gray-500 text-sm">
                THANH TOÁN KHI NHẬN HÀNG
              </p>
            </button>
          </div>
          {/* Nút đặt hàng */}
          <div className="mt-8 w-full text-end">
            <button
              className="bg-black px-16 py-3 text-white text-sm"
              onClick={() => navigate("/orders")}
              type="button"
            >
              ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
