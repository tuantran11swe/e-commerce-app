import { assets } from "../assets/frontend_assets/assets.js";
import Newsletter from "../components/Newsletter.jsx";
import Title from "../components/Title.jsx";

// Component trang Giới thiệu - hiển thị thông tin về công ty và các lý do chọn dịch vụ
const About = () => {
  return (
    <div>
      {/* Phần tiêu đề chính - "VỀ CHÚNG TÔI" */}
      <div className="pt-8 border-t text-2xl text-center">
        <Title text1="VỀ" text2="CHÚNG TÔI" />
      </div>

      {/* Phần nội dung giới thiệu - hiển thị hình ảnh và mô tả về công ty */}
      <div className="flex md:flex-row flex-col gap-16 my-10">
        {/* Hình ảnh giới thiệu - responsive: full width trên mobile, max-width 450px trên desktop */}
        <img
          alt="Về chúng tôi"
          className="w-full md:max-w-[450px]"
          src={assets.aboutImg}
        />
        {/* Phần văn bản giới thiệu - chiếm 2/4 chiều rộng trên desktop */}
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          {/* Đoạn văn giới thiệu về lịch sử hình thành */}
          <p>
            Forever ra đời từ niềm đam mê đổi mới và mong muốn cách mạng hóa
            cách mọi người mua sắm trực tuyến. Hành trình của chúng tôi bắt đầu
            với một ý tưởng đơn giản: tạo ra một nền tảng nơi khách hàng có thể
            dễ dàng khám phá, tìm hiểu và mua sản phẩm từ sự thoải mái trong
            chính ngôi nhà của họ.
          </p>
          {/* Đoạn văn về danh mục sản phẩm */}
          <p>
            Kể từ khi thành lập, chúng tôi đã không ngừng nỗ lực để tuyển chọn
            một danh mục sản phẩm đa dạng chất lượng cao phù hợp với mọi sở
            thích và phong cách. Từ thời trang và làm đẹp đến điện tử và đồ gia
            dụng, chúng tôi cung cấp một bộ sưu tập phong phú được lấy từ các
            thương hiệu và nhà cung cấp đáng tin cậy.
          </p>
          {/* Tiêu đề phụ về sứ mệnh */}
          <b className="text-gray-800">Sứ mệnh của chúng tôi</b>
          {/* Đoạn văn về sứ mệnh công ty */}
          <p>
            Sứ mệnh của Forever là trao quyền cho khách hàng sự lựa chọn, sự
            tiện lợi và sự tự tin. Chúng tôi cam kết cung cấp trải nghiệm mua
            sắm vượt trội mọi lúc, từ duyệt web và đặt hàng đến giao hàng và hơn
            thế nữa.
          </p>
        </div>
      </div>

      {/* Phần tiêu đề phụ - "TẠI SAO CHỌN CHÚNG TÔI" */}
      <div className="py-4 text-xl">
        <Title text1="TẠI SAO" text2="CHỌN CHÚNG TÔI" />
      </div>

      {/* Phần hiển thị các lý do chọn dịch vụ - 3 cột trên desktop, 1 cột trên mobile */}
      <div className="flex md:flex-row flex-col mb-20 text-sm">
        {/* Card 1: Đảm Bảo Chất Lượng */}
        <div className="flex flex-col gap-5 px-10 md:px-16 py-8 sm:py-20 border">
          <b>Đảm Bảo Chất Lượng:</b>
          <p className="text-gray-600">
            Chúng tôi lựa chọn và kiểm tra kỹ lưỡng từng sản phẩm để đảm bảo đáp
            ứng các tiêu chuẩn chất lượng nghiêm ngặt của chúng tôi.
          </p>
        </div>
        {/* Card 2: Tiện Lợi */}
        <div className="flex flex-col gap-5 px-10 md:px-16 py-8 sm:py-20 border">
          <b>Tiện Lợi:</b>
          <p className="text-gray-600">
            Với giao diện thân thiện với người dùng và quy trình đặt hàng dễ
            dàng, mua sắm chưa bao giờ dễ dàng đến thế.
          </p>
        </div>
        {/* Card 3: Dịch Vụ Khách Hàng Xuất Sắc */}
        <div className="flex flex-col gap-5 px-10 md:px-16 py-8 sm:py-20 border">
          <b>Dịch Vụ Khách Hàng Xuất Sắc:</b>
          <p className="text-gray-600">
            Đội ngũ chuyên gia tận tâm của chúng tôi luôn sẵn sàng hỗ trợ bạn
            mọi lúc, đảm bảo sự hài lòng của bạn là ưu tiên hàng đầu của chúng
            tôi.
          </p>
        </div>
      </div>

      {/* Component đăng ký nhận bản tin newsletter */}
      <Newsletter />
    </div>
  );
};

export default About;
