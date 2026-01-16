import { useContext } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const OrderConfirmation = () => {
  const { navigate } = useContext(ShopContext);

  return (
    <div className="flex flex-col justify-center items-center px-4 py-20 text-center">
      <div className="bg-green-100 mb-6 p-6 rounded-full">
        <svg
          aria-label="Đặt hàng thành công"
          className="w-16 h-16 text-green-500"
          fill="none"
          role="img"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Đặt hàng thành công</title>
          <path
            d="M5 13l4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>
      </div>

      <div className="mb-4 text-2xl sm:text-3xl">
        <Title text1={"ĐẶT HÀNG"} text2={"THÀNH CÔNG!"} />
      </div>

      <p className="mb-8 max-w-md text-gray-600 italic">
        Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn đã
        được tiếp nhận và đang được xử lý.
      </p>

      <div className="flex sm:flex-row flex-col gap-4">
        <button
          className="bg-black hover:opacity-90 px-8 py-3 rounded-sm font-medium text-white text-sm transition-all"
          onClick={() => navigate("/orders")}
          type="button"
        >
          XEM ĐƠN HÀNG CỦA TÔI
        </button>
        <button
          className="hover:bg-gray-50 px-8 py-3 border border-gray-300 rounded-sm font-medium text-sm transition-all"
          onClick={() => navigate("/")}
          type="button"
        >
          TIẾP TỤC MUA SẮM
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
