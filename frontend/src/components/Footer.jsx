import { Link } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";

// Component Footer - Phần chân trang của website
const Footer = () => {
  return (
    <div>
      {/* Container chính của footer - responsive grid layout */}
      <div className="flex flex-col gap-14 sm:grid grid-cols-[3fr_1fr_1fr] my-10 mt-40 text-sm">
        {/* Cột đầu tiên - Logo và mô tả */}
        <div>
          <img alt="Logo" className="mb-5 w-32" src={assets.logo} />
          <p className="w-full md:w-2/3 text-gray-600">
            Chúng tôi cam kết mang đến những sản phẩm chất lượng cao và dịch vụ
            tốt nhất cho khách hàng. Đặt niềm tin vào chúng tôi để có trải
            nghiệm mua sắm tuyệt vời nhất.
          </p>
        </div>

        {/* Cột thứ hai - Menu CÔNG TY */}
        <div>
          <p className="mb-5 font-medium text-xl">CÔNG TY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              <Link className="hover:text-black transition-colors" to="/">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link className="hover:text-black transition-colors" to="/about">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link className="hover:text-black transition-colors" to="/orders">
                Giao hàng
              </Link>
            </li>
            <li>
              <Link className="hover:text-black transition-colors" to="/">
                Chính sách bảo mật
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột thứ ba - Thông tin liên hệ */}
        <div>
          <p className="mb-5 font-medium text-xl">LIÊN HỆ</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>0848995246</li>
            <li>tuantran11.swe@gmail.com</li>
            <li className="hover:text-black transition-colors cursor-pointer">
              Instagram
            </li>
          </ul>
        </div>
      </div>

      {/* Phần copyright ở cuối footer */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Bản quyền 2026@ Trần Anh Tuấn - Tất cả các quyền được bảo lưu.
        </p>
      </div>
    </div>
  );
};

export default Footer;
