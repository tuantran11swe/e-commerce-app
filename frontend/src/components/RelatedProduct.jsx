import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

// Component hiển thị các sản phẩm liên quan dựa trên category và subCategory
const RelatedProduct = ({ category, subCategory }) => {
  // Lấy danh sách sản phẩm từ context
  const { products } = useContext(ShopContext);
  // State lưu danh sách sản phẩm liên quan
  const [related, setRelated] = useState([]);

  // Effect để lọc và lấy các sản phẩm liên quan khi products, category hoặc subCategory thay đổi
  useEffect(() => {
    if (products.length > 0) {
      // Tạo bản sao của mảng products để không làm thay đổi mảng gốc
      let productsCopy = products.slice();
      // Lọc các sản phẩm có cùng category
      productsCopy = productsCopy.filter((item) => category === item.category);
      // Lọc các sản phẩm có cùng subCategory
      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory,
      );
      // Lấy tối đa 5 sản phẩm đầu tiên
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-24">
      {/* Tiêu đề section */}
      <div className="py-2 text-3xl text-center">
        <Title text1="SẢN PHẨM" text2="LIÊN QUAN" />
      </div>
      {/* Grid hiển thị danh sách sản phẩm liên quan - responsive từ 2 cột đến 5 cột */}
      <div className="gap-4 gap-y-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {related.map((item) => (
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

export default RelatedProduct;
