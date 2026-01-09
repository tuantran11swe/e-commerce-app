import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

// Component hiển thị bộ sưu tập sản phẩm mới nhất
const LatestCollections = () => {
  // Lấy danh sách sản phẩm từ context
  const { products } = useContext(ShopContext);

  // State lưu danh sách sản phẩm mới nhất
  const [latestProducts, setLatestProducts] = useState([]);

  // Effect để lấy 10 sản phẩm đầu tiên khi danh sách products thay đổi
  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      {/* Phần tiêu đề và mô tả */}
      <div className="py-8 text-3xl text-center">
        <Title text1={"BỘ SƯU TẬP"} text2={"MỚI NHẤT"} />
        <p className="m-auto w-3/4 text-gray-600 text-xs sm:text-sm md:text-base">
          Khám phá những sản phẩm mới nhất được thêm vào cửa hàng của chúng tôi.
          Luôn cập nhật những xu hướng mới nhất.
        </p>
      </div>

      {/* Grid hiển thị danh sách sản phẩm mới nhất */}
      <div className="gap-4 gap-y-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {latestProducts.map((item) => (
          <ProductItem
            id={item._id}
            image={item.image}
            key={item._id}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollections;
