import { useState } from "react";

// Component đăng nhập/đăng ký
const Login = () => {
  // State quản lý trạng thái hiện tại: "ĐĂNG NHẬP" hoặc "ĐĂNG KÝ"
  const [currentState, setCurrentState] = useState("ĐĂNG KÝ");

  // Xử lý submit form
  const onSubmitHandler = async (event) => {
    event.preventDefault();
  };

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
          placeholder="Tên"
          required
          type="text"
        />
      )}

      {/* Input email */}
      <input
        className="px-3 py-2 border border-gray-800 w-full"
        placeholder="Email"
        required
        type="email"
      />

      {/* Input mật khẩu */}
      <input
        className="px-3 py-2 border border-gray-800 w-full"
        placeholder="Mật khẩu"
        required
        type="password"
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
        className="bg-black mt-4 px-8 py-2 font-extralight text-white"
        type="submit"
      >
        {currentState === "ĐĂNG NHẬP" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
      </button>
    </form>
  );
};

export default Login;
