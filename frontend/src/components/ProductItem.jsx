import { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

// Component hiển thị một sản phẩm trong danh sách
const ProductItem = ({ id, image, name, price }) => {
  // Lấy hàm format giá từ context
  const { formatPrice } = useContext(ShopContext);

  return (
    <div>
      {/* Link đến trang chi tiết sản phẩm */}
      <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
        {/* Container hình ảnh với hiệu ứng zoom khi hover */}
        <div className="overflow-hidden">
          <img
            alt={name}
            className="hover:scale-110 transition ease-in-out"
            src={image[0]}
          />
        </div>

        {/* Tên sản phẩm */}
        <p className="pt-3 pb-1 text-sm">{name}</p>

        {/* Giá sản phẩm - format theo định dạng Việt Nam */}
        <p className="font-medium text-sm">{formatPrice(price)}</p>
      </Link>
    </div>
  );
};

export default ProductItem;
