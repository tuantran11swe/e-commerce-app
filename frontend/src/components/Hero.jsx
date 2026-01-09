import { assets } from "../assets/frontend_assets/assets";

// Component Hero - Phần banner chính ở đầu trang chủ
const Hero = () => {
  return (
    <div className="flex sm:flex-row flex-col border border-gray-400">
      {/* Phần bên trái - Nội dung text */}
      <div className="flex justify-center items-center py-10 sm:py-0 w-full sm:w-1/2">
        <div className="text-[#414141]">
          {/* Nhãn sản phẩm bán chạy */}
          <div className="flex items-center gap-2">
            <p className="bg-[#414141] w-8 md:w-11 h-0.5"></p>
            <p className="font-medium text-sm md:text-base">
              SẢN PHẨM BÁN CHẠY
            </p>
          </div>

          {/* Tiêu đề chính */}
          <h1 className="sm:py-3 text-3xl lg:text-5xl leading-relaxed prata-regular">
            Sản Phẩm Mới Nhất
          </h1>

          {/* Call to action */}
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">MUA NGAY</p>
            <p className="bg-[#414141] w-8 md:w-11 h-px"></p>
          </div>
        </div>
      </div>

      {/* Phần bên phải - Hình ảnh hero */}
      <img alt="Hero" className="w-full sm:w-1/2" src={assets.hero_img} />
    </div>
  );
};

export default Hero;
