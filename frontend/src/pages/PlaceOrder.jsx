import { useContext, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosConfig";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { API_ENDPOINTS } from "../config/config";
import { ShopContext } from "../context/ShopContext";

// Component trang đặt hàng - cho phép người dùng nhập thông tin giao hàng và chọn phương thức thanh toán
const PlaceOrder = () => {
  // State quản lý phương thức thanh toán được chọn (mặc định là COD - Cash on Delivery)
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    cartItems,
    getCartAmount,
    deliveryFee,
    products,
    clearCart,
  } = useContext(ShopContext);

  // State cho thông tin giao hàng
  const [formData, setFormData] = useState({
    city: "",
    country: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    state: "",
    street: "",
    zipcode: "",
  });

  // Handle input change
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  // Xử lý khi click đặt hàng
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items),
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        amount: getCartAmount() + deliveryFee,
        items: orderItems,
      };

      switch (method) {
        // COD logic
        case "cod": {
          const response = await axiosInstance.post(
            API_ENDPOINTS.ORDER.PLACE,
            orderData,
          );
          if (response.data.success) {
            clearCart();
            navigate("/order-confirmation");
            toast.success("Đặt hàng thành công!");
          } else {
            toast.error(response.data.message);
          }
          break;
        }

        case "stripe":
          toast.info("Tính năng thanh toán qua Stripe đang được phát triển");
          break;

        case "razorpay":
          toast.info("Tính năng thanh toán qua Razorpay đang được phát triển");
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      className="flex sm:flex-row flex-col justify-between gap-4 pt-5 sm:pt-14 border-t min-h-[80vh]"
      onSubmit={onSubmitHandler}
    >
      {/* Form nhập thông tin giao hàng */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="my-3 text-xl sm:text-2xl">
          <Title text1={"THÔNG TIN"} text2={"GIAO HÀNG"} />
        </div>
        {/* Nhập họ và tên */}
        <div className="flex gap-3">
          <input
            className="px-3.5 py-1.5 border border-gray-300 focus:border-black rounded outline-none w-full"
            name="firstName"
            onChange={onChangeHandler}
            placeholder="Họ"
            required
            type="text"
            value={formData.firstName}
          />
          <input
            className="px-3.5 py-1.5 border border-gray-300 focus:border-black rounded outline-none w-full"
            name="lastName"
            onChange={onChangeHandler}
            placeholder="Tên"
            required
            type="text"
            value={formData.lastName}
          />
        </div>
        {/* Nhập địa chỉ email */}
        <input
          className="px-3.5 py-1.5 border border-gray-300 focus:border-black rounded outline-none w-full"
          name="email"
          onChange={onChangeHandler}
          placeholder="Địa chỉ email"
          required
          type="email"
          value={formData.email}
        />
        {/* Nhập địa chỉ đường phố */}
        <input
          className="px-3.5 py-1.5 border border-gray-300 focus:border-black rounded outline-none w-full"
          name="street"
          onChange={onChangeHandler}
          placeholder="Địa chỉ đường phố"
          required
          type="text"
          value={formData.street}
        />
        {/* Nhập thành phố và tỉnh/thành phố */}
        <div className="flex gap-3">
          <input
            className="px-3.5 py-1.5 border border-gray-300 focus:border-black rounded outline-none w-full"
            name="city"
            onChange={onChangeHandler}
            placeholder="Thành phố"
            required
            type="text"
            value={formData.city}
          />
          <input
            className="px-3.5 py-1.5 border border-gray-300 focus:border-black rounded outline-none w-full"
            name="state"
            onChange={onChangeHandler}
            placeholder="Tỉnh/Thành phố"
            required
            type="text"
            value={formData.state}
          />
        </div>
        {/* Nhập mã bưu điện và quốc gia */}
        <div className="flex gap-3">
          <input
            className="px-3.5 py-1.5 border border-gray-300 focus:border-black rounded outline-none w-full"
            name="zipcode"
            onChange={onChangeHandler}
            placeholder="Mã bưu điện"
            required
            type="text"
            value={formData.zipcode}
          />
          <input
            className="px-3.5 py-1.5 border border-gray-300 focus:border-black rounded outline-none w-full"
            name="country"
            onChange={onChangeHandler}
            placeholder="Quốc gia"
            required
            type="text"
            value={formData.country}
          />
        </div>
        {/* Nhập số điện thoại */}
        <input
          className="px-3.5 py-1.5 border border-gray-300 focus:border-black rounded outline-none w-full"
          name="phone"
          onChange={onChangeHandler}
          placeholder="Số điện thoại"
          required
          type="text"
          value={formData.phone}
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
              className="flex items-center gap-3 p-2 px-3 border focus:border-black outline-none cursor-pointer"
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
              className="flex items-center gap-3 p-2 px-3 border focus:border-black outline-none cursor-pointer"
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
              className="flex items-center gap-3 p-2 px-3 border focus:border-black outline-none cursor-pointer"
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
              className="bg-black active:bg-gray-700 hover:opacity-90 px-16 py-3 font-medium text-white text-sm uppercase transition-all"
              type="submit"
            >
              ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
