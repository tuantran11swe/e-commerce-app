import { assets } from "../assets/frontend_assets/assets.js";

// Component hiển thị các chính sách và dịch vụ của cửa hàng
const OutPolicy = () => {
  return (
    <div className="flex sm:flex-row flex-col justify-around gap-12 sm:gap-2 py-20 text-gray-700 text-xs sm:text-sm md:text-base text-center">
      {/* Chính sách đổi trả dễ dàng */}
      <div>
        <img
          alt="Chính sách đổi trả"
          className="m-auto mb-5 w-12"
          src={assets.exchange_icon}
        />
        <p className="font-semibold">Chính Sách Đổi Trả Dễ Dàng</p>
        <p className="text-gray-400">
          Chúng tôi cung cấp chính sách đổi trả không rắc rối
        </p>
      </div>

      {/* Chính sách trả hàng 7 ngày */}
      <div>
        <img
          alt="Chính sách trả hàng"
          className="m-auto mb-5 w-12"
          src={assets.quality_icon}
        />
        <p className="font-semibold">Chính Sách Trả Hàng 7 Ngày</p>
        <p className="text-gray-400">
          Chúng tôi cung cấp chính sách trả hàng miễn phí trong 7 ngày
        </p>
      </div>

      {/* Hỗ trợ khách hàng tốt nhất */}
      <div>
        <img
          alt="Hỗ trợ khách hàng"
          className="m-auto mb-5 w-12"
          src={assets.support_img}
        />
        <p className="font-semibold">Hỗ Trợ Khách Hàng Tốt Nhất</p>
        <p className="text-gray-400">
          Chúng tôi cung cấp hỗ trợ khách hàng 24/7
        </p>
      </div>
    </div>
  );
};

export default OutPolicy;
