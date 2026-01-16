import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendURL } from "../config/constants";

/**
 * Component Login - Trang đăng nhập cho admin
 * @param {Function} setToken - Hàm để cập nhật token sau khi đăng nhập thành công
 */
const Login = ({ setToken }) => {
  // Hook để điều hướng trang
  const navigate = useNavigate();
  // State lưu trữ email đăng nhập (có giá trị mặc định)
  const [email, setEmail] = useState("admin@example.com");
  // State lưu trữ mật khẩu (có giá trị mặc định)
  const [password, setPassword] = useState("adminpassword");
  // State điều khiển hiển thị/ẩn mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handler xử lý submit form đăng nhập
   * Gửi request đến API để xác thực thông tin đăng nhập
   */
  const onSubmitHandler = async (e) => {
    try {
      // Ngăn chặn hành vi mặc định của form (reload trang)
      e.preventDefault();
      // Gửi request POST đến API đăng nhập admin
      const response = await axios.post(`${backendURL}/api/user/admin`, {
        email,
        password,
      });
      // Nếu đăng nhập thành công
      if (response.data.success) {
        // Hiển thị thông báo đăng nhập thành công
        toast.success("Đăng nhập thành công");
        // Lưu token vào state và localStorage
        // Token được trả về trong response.data.data.token (nested trong object data)
        setToken(response.data.data.token);
        // Chuyển hướng đến trang thêm sản phẩm
        navigate("/add");
      } else {
        // Hiển thị thông báo lỗi nếu đăng nhập thất bại
        toast.error(response.data.message);
      }
    } catch (error) {
      // Log lỗi ra console để debug
      console.log(error);
      // Hiển thị thông báo lỗi từ response hoặc message mặc định
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      {/* Container form đăng nhập */}
      <div className="bg-white shadow-md px-8 py-6 rounded-lg max-w-md">
        {/* Tiêu đề trang */}
        <h1 className="mb-4 font-bold text-2xl">Bảng Quản Trị</h1>
        <form onSubmit={onSubmitHandler}>
          {/* Trường nhập email */}
          <div className="mb-3 min-w-72">
            <p className="mb-2 font-medium text-gray-700 text-sm">
              Địa chỉ Email
            </p>
            <input
              className="px-3 py-2 border border-gray-300 rounded-md outline-none w-full"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              type="email"
              value={email}
            />
          </div>
          {/* Trường nhập mật khẩu */}
          <div className="mb-3 min-w-72">
            <p className="mb-2 font-medium text-gray-700 text-sm">Mật khẩu</p>
            <div className="relative">
              {/* Input mật khẩu với khả năng hiển thị/ẩn */}
              <input
                className="px-3 py-2 border border-gray-300 rounded-md outline-none w-full"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              {/* Nút toggle hiển thị/ẩn mật khẩu */}
              <button
                className="top-1/2 right-3 absolute focus:outline-none text-gray-500 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? (
                  // Icon ẩn mật khẩu (khi đang hiển thị)
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Ẩn mật khẩu</title>
                    <path
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  // Icon hiển thị mật khẩu (khi đang ẩn)
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Hiển thị mật khẩu</title>
                    <path
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {/* Nút submit form đăng nhập */}
          <button
            className="bg-black mt-2 px-4 py-2 rounded-md w-full text-white"
            type="submit"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
