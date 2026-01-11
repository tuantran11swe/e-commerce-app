import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { products } from "../assets/frontend_assets/assets";

// Tạo context để chia sẻ dữ liệu shop giữa các component trong ứng dụng
// Context này giúp tránh prop drilling và quản lý state tập trung
export const ShopContext = createContext();

// Hàm format giá theo định dạng Việt Nam (dấu chấm phân cách hàng nghìn)
// Ví dụ: 150000 -> "150.000 ₫"
const formatPrice = (price) => {
  // Chuyển số thành chuỗi và thêm dấu chấm phân cách hàng nghìn
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedPrice} ₫`;
};

// Provider component cung cấp dữ liệu và hàm xử lý cho tất cả component con
// Component này bao bọc toàn bộ ứng dụng để các component con có thể truy cập dữ liệu
const ShopContextProvider = (props) => {
  // Đơn vị tiền tệ sử dụng trong ứng dụng (đồng Việt Nam)
  const currency = "₫";

  // Phí vận chuyển mặc định (đơn vị: nghìn đồng)
  const delivery_fee = 10000;

  // State quản lý từ khóa tìm kiếm của người dùng
  const [search, setSearch] = useState("");

  // State quản lý trạng thái hiển thị/ẩn thanh tìm kiếm
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }
    // Tìm thông tin sản phẩm để hiển thị trong thông báo
    const product = products.find((p) => p._id === itemId);
    const productName = product ? product.name : "Sản phẩm";

    const cartData = structuredClone(cartItems);
    let isNewItem = false;
    let newQuantity = 1;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        // Sản phẩm đã có trong giỏ, tăng số lượng
        cartData[itemId][size] += 1;
        newQuantity = cartData[itemId][size];
      } else {
        // Sản phẩm có nhưng chưa có size này
        cartData[itemId][size] = 1;
        isNewItem = true;
      }
    } else {
      // Sản phẩm mới hoàn toàn
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
      isNewItem = true;
    }

    setCartItems(cartData);

    // Hiển thị thông báo thành công
    if (isNewItem) {
      toast.success(
        `${productName} (Size: ${size}) đã được thêm vào giỏ hàng!`,
      );
    } else {
      toast.success(
        `${productName} (Size: ${size}) - Số lượng: ${newQuantity}`,
      );
    }
  };
  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateQuantity = (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  // Tính tổng tiền các sản phẩm trong giỏ hàng
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };
  // Object chứa tất cả giá trị và hàm cần chia sẻ qua context
  // Các component con có thể sử dụng các giá trị này thông qua useContext hook
  const value = {
    addToCart, //thêm vào giỏ hàng
    cartItems, //giỏ hàng
    currency, // Đơn vị tiền tệ
    delivery_fee, // Phí vận chuyển
    formatPrice, // Hàm format giá theo định dạng Việt Nam
    getCartAmount, //tổng tiền các sản phẩm trong giỏ hàng
    getCartCount, //tính tổng số lượng sản phẩm trong giỏ hàng
    products, // Danh sách tất cả sản phẩm
    search, // Từ khóa tìm kiếm hiện tại
    setSearch, // Hàm cập nhật từ khóa tìm kiếm
    setShowSearch, // Hàm hiển thị/ẩn thanh tìm kiếm
    showSearch, // Trạng thái hiển thị thanh tìm kiếm
    updateQuantity,
  };

  // Trả về Provider component với value chứa tất cả dữ liệu cần chia sẻ
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
