import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

// Component hiển thị các sản phẩm bán chạy nhất
const BestSeller = () => {
  // Lấy danh sách sản phẩm từ context
  const { products } = useContext(ShopContext);

  // State lưu danh sách sản phẩm bán chạy
  const [bestSeller, setBestSeller] = useState([]);

  // Effect để lọc và lấy 5 sản phẩm bán chạy nhất khi danh sách products thay đổi
  useEffect(() => {
    // Lọc các sản phẩm có thuộc tính bestseller = true
    const bestProduct = products.filter((item) => item.bestseller);
    // Chỉ lấy 5 sản phẩm đầu tiên
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      {/* Phần tiêu đề và mô tả */}
      <div className="py-8 text-3xl text-center">
        <Title text1={"SẢN PHẨM"} text2={"BÁN CHẠY"} />
        <p className="m-auto w-3/4 text-gray-600 text-xs sm:text-sm md:text-base">
          Khám phá những sản phẩm được yêu thích nhất của chúng tôi. Chất lượng
          cao và được khách hàng tin tưởng.
        </p>
      </div>

      {/* Grid hiển thị danh sách sản phẩm bán chạy */}
      <div className="gap-4 gap-y-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {bestSeller.map((item) => (
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

export default BestSeller;
