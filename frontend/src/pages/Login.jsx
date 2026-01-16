import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_BASE_URL, API_ENDPOINTS } from "../config/config.js";
import { ShopContext } from "../context/ShopContext";

// Component đăng nhập/đăng ký
const Login = () => {
  // State quản lý trạng thái hiện tại: "ĐĂNG NHẬP" hoặc "ĐĂNG KÝ"
  const [currentState, setCurrentState] = useState("ĐĂNG KÝ");

  // State quản lý các trường input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Lấy các giá trị cần thiết từ ShopContext
  const { token, setToken, navigate } = useContext(ShopContext);
  const [_loading, _setLoading] = useState(false); // Local loading for form submission

  // Xử lý submit form
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currentState === "ĐĂNG KÝ") {
        // Gọi API đăng ký
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.USER.REGISTER}`,
          { email, name, password },
        );

        if (response.data.success) {
          toast.success("Đăng ký thành công!");
          setToken(response.data.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Gọi API đăng nhập
        const response = await axios.post(
          `${API_BASE_URL}${API_ENDPOINTS.USER.LOGIN}`,
          { email, password },
        );

        if (response.data.success) {
          toast.success("Đăng nhập thành công!");
          setToken(response.data.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    }
  };

  // Nếu đã có token (đã đăng nhập) thì chuyển hướng về trang chủ
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <form
      action=""
      className="flex flex-col items-center gap-4 m-auto w-[90%] sm:max-w-96 text-gray-800 mt14"
      onSubmit={onSubmitHandler}
    >
      {/* Header hiển thị trạng thái hiện tại */}
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl prata-regular">{currentState}</p>
        <hr className="bg-gray-800 border-none w-8 h-[1.5px]" />
      </div>

      {/* Hiển thị input tên chỉ khi ở chế độ đăng ký */}
      {currentState === "ĐĂNG NHẬP" ? (
        ""
      ) : (
        <input
          className="px-3 py-2 border border-gray-800 w-full"
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên"
          required
          type="text"
          value={name}
        />
      )}

      {/* Input email */}
      <input
        className="px-3 py-2 border border-gray-800 w-full"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        type="email"
        value={email}
      />

      {/* Input mật khẩu */}
      <input
        className="px-3 py-2 border border-gray-800 w-full"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mật khẩu"
        required
        type="password"
        value={password}
      />

      {/* Footer với link quên mật khẩu và chuyển đổi giữa đăng nhập/đăng ký */}
      <div className="flex justify-between mt-[8px] w-full text-sm">
        <p className="cursor-pointer">QUÊN MẬT KHẨU?</p>
        {currentState === "ĐĂNG NHẬP" ? (
          <button
            className="bg-transparent p-0 border-none text-gray-800 text-sm cursor-pointer"
            onClick={() => setCurrentState("ĐĂNG KÝ")}
            type="button"
          >
            TẠO TÀI KHOẢN
          </button>
        ) : (
          <button
            className="bg-transparent p-0 border-none text-gray-800 text-sm cursor-pointer"
            onClick={() => setCurrentState("ĐĂNG NHẬP")}
            type="button"
          >
            ĐĂNG NHẬP TẠI ĐÂY
          </button>
        )}
      </div>

      {/* Button submit form */}
      <button
        className="bg-black mt-4 px-8 py-2 font-extralight text-white cursor-pointer"
        type="submit"
      >
        {currentState === "ĐĂNG NHẬP" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
      </button>
    </form>
  );
};

export default Login;
