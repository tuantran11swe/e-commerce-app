import { useState } from "react";

// Component đăng ký nhận bản tin newsletter
const Newletter = () => {
  // State lưu giá trị email người dùng nhập
  const [email, setEmail] = useState("");

  // Xử lý submit form đăng ký newsletter
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Xử lý đăng ký newsletter
    console.log("Email đăng ký:", email);
    // Reset input sau khi submit
    setEmail("");
  };

  return (
    <div className="text-center">
      {/* Tiêu đề khuyến mãi */}
      <p className="font-medium text-gray-800 text-2xl">
        Đăng ký ngay & nhận giảm 20%
      </p>

      {/* Mô tả */}
      <p className="mt-3 text-gray-400">
        Nhận thông tin về các sản phẩm mới và ưu đãi đặc biệt qua email.
      </p>

      {/* Form đăng ký */}
      <form
        className="flex items-center gap-3 mx-auto my-6 pl-3 border w-full sm:w-1/2"
        onSubmit={handleSubmit}
      >
        {/* Input nhập email */}
        <input
          className="sm:flex-1 outline-none w-full"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          required
          type="email"
          value={email}
        />

        {/* Nút đăng ký */}
        <button
          className="bg-black px-10 py-4 text-white text-xs"
          type="submit"
        >
          ĐĂNG KÝ
        </button>
      </form>
    </div>
  );
};

export default Newletter;
