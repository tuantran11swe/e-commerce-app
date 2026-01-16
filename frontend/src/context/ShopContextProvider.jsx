import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosConfig";
import { fetchProducts } from "../api/productApi";
import { API_ENDPOINTS } from "../config/config";
import { ShopContext } from "./ShopContext";

// Hàm format giá theo định dạng Việt Nam (dấu chấm phân cách hàng nghìn)
// Ví dụ: 150000 -> "150.000 ₫"
const formatPrice = (price) => {
  // Kiểm tra nếu price không hợp lệ (undefined, null, NaN) thì trả về giá trị mặc định
  if (price === undefined || price === null || Number.isNaN(Number(price))) {
    return "0 ₫";
  }
  // Chuyển số thành chuỗi và thêm dấu chấm phân cách hàng nghìn
  const formattedPrice = Number(price)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedPrice} ₫`;
};

// Provider component cung cấp dữ liệu và hàm xử lý cho tất cả component con
// Component này bao bọc toàn bộ ứng dụng để các component con có thể truy cập dữ liệu
const ShopContextProvider = (props) => {
  // Đơn vị tiền tệ sử dụng trong ứng dụng (đồng Việt Nam)
  const currency = "₫";

  // Phí vận chuyển mặc định (đơn vị: nghìn đồng)
  const deliveryFee = 10000;

  // State quản lý danh sách sản phẩm từ backend
  const [products, setProducts] = useState([]);

  // State quản lý người dùng hiện tại
  const [user, setUser] = useState(null);

  // State quản lý từ khóa tìm kiếm của người dùng
  const [search, setSearch] = useState("");

  // State quản lý trạng thái hiển thị/ẩn thanh tìm kiếm
  const [showSearch, setShowSearch] = useState(false);

  // State quản lý trạng thái loading khi fetch dữ liệu/thực hiện tác vụ
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  // State quản lý lỗi nếu có
  const [error, setError] = useState(null);

  // State quản lý giỏ hàng - Khởi tạo từ localStorage nếu có
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return {};
    }
  });

  // State quản lý token xác thực
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const navigate = useNavigate();

  // Hàm lấy thông tin user từ backend
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER.PROFILE);
      if (response.data.success) {
        setUser(response.data.data.user);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, []);

  // Lấy giỏ hàng từ server
  const getCartFromServer = useCallback(async () => {
    // Kiểm tra token từ localStorage để đảm bảo token vẫn còn tồn tại
    const currentToken = localStorage.getItem("token");
    if (!currentToken || !token) return;
    try {
      setCartLoading(true);
      const response = await axiosInstance.get(API_ENDPOINTS.CART.GET);
      if (response.data.success) {
        setCartItems(response.data.data.cart);
      }
    } catch (error) {
      // Chỉ log lỗi nếu không phải lỗi 401 (401 đã được xử lý bởi axios interceptor)
      if (error.response?.status !== 401) {
        console.error("Error getting cart:", error);
      }
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  // Đồng bộ giỏ hàng từ localStorage lên server khi đăng nhập
  const _syncCartWithBackend = useCallback(async () => {
    // Kiểm tra token từ localStorage để đảm bảo token vẫn còn tồn tại
    const currentToken = localStorage.getItem("token");
    if (!currentToken || !token || Object.keys(cartItems).length === 0) return;
    try {
      setCartLoading(true);
      await axiosInstance.post(API_ENDPOINTS.CART.SYNC, { cart: cartItems });
      // Lấy giỏ hàng mới nhất từ server sau khi sync
      getCartFromServer();
    } catch (error) {
      // Chỉ log lỗi nếu không phải lỗi 401 (401 đã được xử lý bởi axios interceptor)
      if (error.response?.status !== 401) {
        console.error("Error syncing cart:", error);
      }
    } finally {
      setCartLoading(false);
    }
  }, [token, cartItems, getCartFromServer]);

  // Effect để lưu token và fetch profile khi đổi token
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUserProfile();
      // Lấy giỏ hàng từ server khi có token mới để đồng bộ
      // Không sync cartItems từ localStorage lên server ở đây để tránh ghi đè giỏ hàng trên server
      getCartFromServer();
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
    // Chỉ chạy khi token thay đổi, không phụ thuộc vào cartItems để tránh vòng lặp vô hạn
  }, [
    token,
    fetchUserProfile, // Lấy giỏ hàng từ server khi có token mới để đồng bộ
    // Không sync cartItems từ localStorage lên server ở đây để tránh ghi đè giỏ hàng trên server
    getCartFromServer,
  ]);

  // Effect để lưu giỏ hàng vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch products từ backend khi component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch tất cả sản phẩm (có thể thêm params nếu cần)
        const { products: fetchedProducts } = await fetchProducts({
          limit: 100, // Lấy nhiều sản phẩm hơn, có thể điều chỉnh
        });

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(err.message);
        toast.error(err.message || "Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []); // Chỉ chạy một lần khi component mount

  // Hàm thêm sản phẩm vào giỏ hàng
  // itemId: ID của sản phẩm cần thêm
  // size: Kích thước của sản phẩm (bắt buộc)
  const addToCart = async (itemId, size) => {
    // Kiểm tra nếu chưa chọn kích thước thì hiển thị lỗi và dừng lại
    if (!size) {
      toast.error("Vui lòng chọn kích thước");
      return;
    }

    // Nếu đã đăng nhập, gọi API để lưu vào database
    if (token) {
      try {
        setCartLoading(true);
        const response = await axiosInstance.post(API_ENDPOINTS.CART.ADD, {
          productId: itemId,
          quantity: 1,
          size,
        });

        if (response.data.success) {
          // Sync state locally with response from server
          setCartItems(response.data.data.cart);
          toast.success("Đã thêm vào giỏ hàng!");
        }
      } catch (error) {
        console.error("Add to cart API error:", error);
        toast.error("Không thể thêm vào giỏ hàng");
      } finally {
        setCartLoading(false);
      }
      return;
    }

    // Logic cho khách vãng lai (lưu local)
    const product = products.find((p) => p._id === itemId);
    const productName = product ? product.name : "Sản phẩm";
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
    toast.success(`${productName} (Size: ${size}) đã được thêm vào giỏ hàng!`);
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
  const updateQuantity = async (itemId, size, quantity) => {
    // Nếu đã đăng nhập, cập nhật lên server
    if (token) {
      try {
        setCartLoading(true);
        const response = await axiosInstance.put(API_ENDPOINTS.CART.UPDATE, {
          productId: itemId,
          quantity,
          size,
        });

        if (response.data.success) {
          setCartItems(response.data.data.cart);
        }
      } catch (error) {
        console.error("Update quantity API error:", error);
        toast.error("Không thể cập nhật số lượng");
      } finally {
        setCartLoading(false);
      }
      return;
    }

    // Cho khách vãng lai
    const cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  // Tính tổng tiền các sản phẩm trong giỏ hàng
  // Nhân giá sản phẩm với số lượng của từng size để tính tổng
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue; // Bỏ qua nếu không tìm thấy info sản phẩm

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

  // Hàm đăng xuất
  const logout = () => {
    setToken("");
    setUser(null);
    setCartItems([]);
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    toast.success("Đã đăng xuất");
    navigate("/login");
  };

  // Hàm xóa giỏ hàng (sau khi đặt hàng)
  const clearCart = async () => {
    // Xóa giỏ hàng ở local state trước
    setCartItems({});
    localStorage.removeItem("cart");

    // Kiểm tra token từ localStorage để đảm bảo token vẫn còn tồn tại trước khi gọi API
    const currentToken = localStorage.getItem("token");
    if (currentToken && token) {
      try {
        // Backend sử dụng POST method cho endpoint clear
        await axiosInstance.post(API_ENDPOINTS.CART.CLEAR);
      } catch (error) {
        // Chỉ log lỗi nếu không phải lỗi 401 (401 đã được xử lý bởi axios interceptor)
        if (error.response?.status !== 401) {
          console.error("Error clearing backend cart:", error);
        }
      }
    }
  };
  // Object chứa tất cả giá trị và hàm cần chia sẻ qua context
  // Các component con có thể sử dụng các giá trị này thông qua useContext hook
  const value = {
    addToCart,
    cartItems,
    cartLoading,
    clearCart,
    currency,
    deliveryFee,
    error,
    formatPrice,
    getCartAmount,
    getCartCount,
    loading,
    logout,
    navigate,
    products,
    search,
    setSearch,
    setShowSearch,
    setToken,
    showSearch,
    token,
    updateQuantity,
    user,
  };

  // Trả về Provider component với value chứa tất cả dữ liệu cần chia sẻ
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
