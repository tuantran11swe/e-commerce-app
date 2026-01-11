import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  // Hàm thêm sản phẩm vào giỏ hàng
  // itemId: ID của sản phẩm cần thêm
  // size: Kích thước của sản phẩm (bắt buộc)
  const addToCart = (itemId, size) => {
    // Kiểm tra nếu chưa chọn kích thước thì hiển thị lỗi và dừng lại
    if (!size) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }
    // Tìm thông tin sản phẩm để hiển thị trong thông báo
    const product = products.find((p) => p._id === itemId);
    const productName = product ? product.name : "Sản phẩm";

    // Tạo bản sao của giỏ hàng hiện tại để tránh mutation trực tiếp
    const cartData = structuredClone(cartItems);
    let isNewItem = false; // Flag để xác định sản phẩm mới hay đã tồn tại
    let newQuantity = 1; // Số lượng mới sau khi thêm

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    if (cartData[itemId]) {
      // Sản phẩm đã có, kiểm tra size đã có chưa
      if (cartData[itemId][size]) {
        // Sản phẩm đã có trong giỏ với size này, tăng số lượng lên 1
        cartData[itemId][size] += 1;
        newQuantity = cartData[itemId][size];
      } else {
        // Sản phẩm có nhưng chưa có size này, thêm size mới với số lượng 1
        cartData[itemId][size] = 1;
        isNewItem = true;
      }
    } else {
      // Sản phẩm mới hoàn toàn, tạo object mới cho sản phẩm này
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
      isNewItem = true;
    }

    // Cập nhật state giỏ hàng với dữ liệu mới
    setCartItems(cartData);

    // Hiển thị thông báo thành công tùy theo sản phẩm mới hay đã tồn tại
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
  // Duyệt qua tất cả sản phẩm và các size để tính tổng số lượng
  const getCartCount = () => {
    let totalCount = 0;
    // Duyệt qua từng sản phẩm trong giỏ hàng
    for (const items in cartItems) {
      // Duyệt qua từng size của sản phẩm
      for (const item in cartItems[items]) {
        try {
          // Chỉ tính các sản phẩm có số lượng > 0
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          // Xử lý lỗi nếu có vấn đề khi đọc dữ liệu
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  // itemId: ID của sản phẩm cần cập nhật
  // size: Kích thước của sản phẩm
  // quantity: Số lượng mới (nếu = 0 thì sẽ xóa sản phẩm)
  const updateQuantity = (itemId, size, quantity) => {
    // Tạo bản sao của giỏ hàng để tránh mutation trực tiếp
    const cartData = structuredClone(cartItems);
    // Cập nhật số lượng cho sản phẩm và size cụ thể
    cartData[itemId][size] = quantity;
    // Cập nhật state với dữ liệu mới
    setCartItems(cartData);
  };

  // Tính tổng tiền các sản phẩm trong giỏ hàng
  // Nhân giá sản phẩm với số lượng của từng size để tính tổng
  const getCartAmount = () => {
    let totalAmount = 0;
    // Duyệt qua từng sản phẩm trong giỏ hàng
    for (const items in cartItems) {
      // Tìm thông tin sản phẩm (giá, tên, ...) từ danh sách products
      const itemInfo = products.find((product) => product._id === items);
      // Duyệt qua từng size của sản phẩm
      for (const item in cartItems[items]) {
        try {
          // Chỉ tính các sản phẩm có số lượng > 0
          if (cartItems[items][item] > 0) {
            // Cộng dồn: giá sản phẩm × số lượng
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          // Xử lý lỗi nếu có vấn đề khi đọc dữ liệu hoặc tính toán
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
    navigate, // Hàm điều hướng router
    products, // Danh sách tất cả sản phẩm
    search, // Từ khóa tìm kiếm hiện tại
    setSearch, // Hàm cập nhật từ khóa tìm kiếm
    setShowSearch, // Hàm hiển thị/ẩn thanh tìm kiếm
    showSearch, // Trạng thái hiển thị thanh tìm kiếm
    updateQuantity, // Cập nhật số lượng sản phẩm trong giỏ hàng
  };

  // Trả về Provider component với value chứa tất cả dữ liệu cần chia sẻ
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
