import { assets } from "../assets/frontend_assets/assets.js";
import Newsletter from "../components/Newsletter.jsx";
import Title from "../components/Title.jsx";

// Component trang Liên hệ - hiển thị thông tin liên hệ và cơ hội việc làm
const Contact = () => {
  return (
    <div>
      {/* Phần tiêu đề chính - "LIÊN HỆ VỚI CHÚNG TÔI" */}
      <div className="pt-10 border-t text-center">
        <Title text1="LIÊN HỆ" text2="VỚI CHÚNG TÔI" />
      </div>

      {/* Phần nội dung liên hệ - hiển thị hình ảnh và thông tin liên hệ */}
      <div className="flex md:flex-row flex-col justify-center gap-10 my-10 mb-28">
        {/* Hình ảnh liên hệ - responsive: full width trên mobile, max-width 480px trên desktop */}
        <img
          alt="Liên hệ"
          className="w-full md:max-w-[480px]"
          src={assets.contactImg}
        />
        {/* Phần thông tin liên hệ và tuyển dụng */}
        <div className="flex flex-col justify-center items-start gap-6">
          {/* Tiêu đề phần thông tin cửa hàng */}
          <p className="font-semibold text-gray-600 text-xl">
            Cửa Hàng Của Chúng Tôi
          </p>
          {/* Địa chỉ cửa hàng */}
          <p className="text-gray-500">
            12 Nguyễn Văn Bảo <br />
            Phường Hạnh Thông, Thành phố Hồ Chí Minh
          </p>
          {/* Thông tin liên hệ: điện thoại và email */}
          <p className="text-gray-500">
            Điện thoại: 0848995246 <br />
            Email: tuantran11.swe@gmail.com
          </p>
          {/* Tiêu đề phần cơ hội việc làm */}
          <p className="font-semibold text-gray-600 text-xl">
            Cơ Hội Việc Tại Forever
          </p>
          {/* Mô tả về cơ hội việc làm */}
          <p className="text-gray-500">
            Tìm hiểu thêm về các đội nhóm và cơ hội việc làm của chúng tôi.
          </p>
          {/* Nút xem các vị trí tuyển dụng - có hiệu ứng hover đổi màu */}
          <button
            className="hover:bg-black px-8 py-4 border border-black hover:text-white text-sm transition-all duration-500 cursor-pointer"
            type="button"
          >
            XEM CÁC VỊ TRÍ TUYỂN DỤNG
          </button>
        </div>
      </div>

      {/* Component đăng ký nhận bản tin newsletter */}
      <Newsletter />
    </div>
  );
};

export default Contact;
