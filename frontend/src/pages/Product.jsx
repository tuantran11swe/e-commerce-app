import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProduct from "../components/RelatedProduct";
import { ShopContext } from "../context/ShopContext";

// Component trang chi tiết sản phẩm
const Product = () => {
  // Lấy productId từ URL params
  const { productId } = useParams();
  // Lấy products và formatPrice từ context
  const { products, formatPrice } = useContext(ShopContext);
  // State lưu thông tin chi tiết sản phẩm
  const [productData, setProductData] = useState(false);
  // State lưu hình ảnh đang được chọn để hiển thị
  const [image, setImage] = useState("");
  // State lưu kích thước đang được chọn
  const [size, setSize] = useState("");

  // Hàm lấy thông tin sản phẩm dựa trên productId
  const fetchProductData = useCallback(() => {
    products.forEach((item) => {
      if (item._id === productId) {
        setProductData(item);
        // Set hình ảnh đầu tiên làm hình ảnh mặc định
        setImage(item.image?.[0] || "");
      }
    });
  }, [products, productId]);

  // Effect để fetch dữ liệu sản phẩm khi component mount hoặc dependencies thay đổi
  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  // Nếu có dữ liệu sản phẩm thì hiển thị, nếu không thì hiển thị loading
  return productData ? (
    <div className="opacity-100 pt-10 border-t-2 transition-opacity duration-500 ease-in">
      {/* Container chính chứa hình ảnh và thông tin sản phẩm */}
      <div className="flex sm:flex-row flex-col gap-12 sm:gap-12">
        {/* Phần hiển thị hình ảnh sản phẩm */}
        <div className="flex sm:flex-row flex-col-reverse flex-1 gap-2 sm:gap-4">
          {/* Danh sách hình ảnh nhỏ để chọn - scroll ngang trên mobile, scroll dọc trên desktop */}
          <div className="flex sm:flex-col justify-between sm:justify-normal w-full sm:w-[18.7%] overflow-x-auto sm:overflow-y-scroll">
            {productData.image.map((item) => (
              <img
                alt={`Hình ảnh sản phẩm ${productData.name}`}
                className="sm:mb-3 w-[24%] sm:w-full cursor-pointer shrink-0"
                key={item}
                onClick={() => setImage(item)}
                onKeyDown={(e) => {
                  // Hỗ trợ keyboard navigation - Enter hoặc Space để chọn hình
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setImage(item);
                  }
                }}
                src={item}
              />
            ))}
          </div>
          {/* Hình ảnh lớn hiển thị sản phẩm */}
          <div className="w-full sm:w-[80%]">
            <img alt="" className="w-full h-auto" src={image} />
          </div>
        </div>

        {/* Phần thông tin chi tiết sản phẩm */}
        <div className="flex-1">
          {/* Tên sản phẩm */}
          <h1 className="mt-2 font-medium text-2xl">{productData.name}</h1>
          {/* Đánh giá sao */}
          <div className="flex items-center gap-1 mt-2">
            <img alt="" className="w-3.5" src={assets.star_icon} />
            <img alt="" className="w-3.5" src={assets.star_icon} />
            <img alt="" className="w-3.5" src={assets.star_icon} />
            <img alt="" className="w-3.5" src={assets.star_icon} />
            <img alt="" className="w-3.5" src={assets.star_icon} />
            <p className="pl-2">(100)</p>
          </div>
          {/* Giá sản phẩm - format theo định dạng Việt Nam */}
          <p className="mt-5 font-medium text-3xl">
            {formatPrice(productData.price)}
          </p>
          {/* Mô tả ngắn sản phẩm */}
          <p className="mt-5 md:w-4/5 text-gray-500">
            {productData.description}
          </p>
          {/* Phần chọn kích thước */}
          <div className="flex flex-col gap-4 my-8">
            <p>Chọn kích thước</p>
            <div className="flex gap-2">
              {productData.sizes.map((item) => (
                <button
                  className={`py-2 px-4 bg-gray-100 cursor-pointer ${
                    item === size ? "border-2 border-orange-500" : ""
                  }`}
                  key={item}
                  onClick={() => setSize(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          {/* Nút thêm vào giỏ hàng */}
          <button
            className="bg-black active:bg-gray-700 px-8 py-3 text-white text-sm cursor-pointer"
            type="button"
          >
            THÊM VÀO GIỎ
          </button>
          <hr className="mt-8 sm:w-4/5" />
          {/* Thông tin chính sách và cam kết */}
          <div className="flex flex-col gap-1 mt-5 text-gray-500 text-sm">
            <p>Sản phẩm chính hãng 100%.</p>
            <p>Thanh toán khi nhận hàng có sẵn cho sản phẩm này.</p>
            <p>Chính sách đổi trả dễ dàng trong vòng 7 ngày.</p>
          </div>
        </div>
      </div>

      {/* Phần mô tả chi tiết và đánh giá */}
      <div className="mt-20">
        {/* Tab điều hướng giữa Mô tả và Đánh giá */}
        <div className="flex">
          <b className="px-5 py-3 border text-sm">Mô tả</b>
          <p className="px-5 py-3 border text-sm">Đánh giá (100)</p>
        </div>
        {/* Nội dung mô tả chi tiết */}
        <div className="flex flex-col gap-4 px-6 py-6 border text-gray-500 text-sm">
          <p>
            Một trang web thương mại điện tử là một nền tảng trực tuyến tạo điều
            kiện cho việc mua và bán sản phẩm hoặc dịch vụ qua internet. Nó hoạt
            động như một thị trường ảo nơi các doanh nghiệp và cá nhân có thể
            trưng bày sản phẩm của họ, tương tác với khách hàng và thực hiện các
            giao dịch mà không cần có mặt trực tiếp. Các trang web thương mại
            điện tử đã trở nên cực kỳ phổ biến nhờ sự tiện lợi, khả năng tiếp
            cận và phạm vi toàn cầu mà chúng mang lại.
          </p>
          <p>
            Các trang web thương mại điện tử thường hiển thị sản phẩm hoặc dịch
            vụ cùng với mô tả chi tiết, hình ảnh, giá cả và các biến thể có sẵn
            (ví dụ: kích thước, màu sắc). Mỗi sản phẩm thường có trang riêng với
            thông tin liên quan.
          </p>
        </div>
      </div>

      {/* Component hiển thị sản phẩm liên quan */}
      <RelatedProduct
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0">Đang tải...</div>
  );
};

export default Product;
