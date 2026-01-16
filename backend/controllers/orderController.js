import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

/**
 * Controller xử lý đặt hàng mới
 * Tạo đơn hàng mới từ thông tin sản phẩm, địa chỉ và phương thức thanh toán
 * Sau khi tạo đơn hàng thành công, sẽ xóa giỏ hàng của người dùng
 *
 * @param {Object} req - Request object chứa thông tin đơn hàng trong body
 * @param {Object} res - Response object để trả về kết quả
 * @returns {Promise<Object>} JSON response chứa thông tin đơn hàng đã tạo hoặc lỗi
 */
export const placeOrder = async (req, res) => {
  try {
    // Lấy thông tin đơn hàng từ request body
    const { items, amount, address, paymentMethod } = req.body;
    // Lấy userId từ thông tin người dùng đã được xác thực (từ middleware userAuth)
    const userId = req.user?.userId;

    // Kiểm tra xác thực người dùng
    if (!userId) {
      return res.status(401).json({
        message: "Người dùng chưa được xác thực",
        success: false,
      });
    }

    // Kiểm tra danh sách sản phẩm phải là mảng và không rỗng
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Danh sách sản phẩm không được để trống",
        success: false,
      });
    }

    // Kiểm tra tổng tiền phải là số hợp lệ và lớn hơn 0
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Tổng tiền không hợp lệ",
        success: false,
      });
    }

    // Kiểm tra địa chỉ giao hàng phải là object hợp lệ
    if (!address || typeof address !== "object") {
      return res.status(400).json({
        message: "Thông tin địa chỉ giao hàng không hợp lệ",
        success: false,
      });
    }

    // Chuẩn hóa dữ liệu sản phẩm, chỉ lấy các trường cần thiết
    const normalizedItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size,
    }));

    // Tạo đơn hàng mới với các thông tin đã được validate
    const newOrder = new Order({
      address, // Địa chỉ giao hàng
      amount, // Tổng tiền đơn hàng
      items: normalizedItems, // Danh sách sản phẩm đã được chuẩn hóa
      payment: false, // Mặc định chưa thanh toán
      paymentMethod: paymentMethod || "COD", // Phương thức thanh toán, mặc định là COD (Cash on Delivery)
      status: "Đang xử lý", // Trạng thái ban đầu của đơn hàng
      userId, // ID người dùng đặt hàng
    });

    // Lưu đơn hàng vào database
    await newOrder.save();

    // Xóa giỏ hàng của người dùng sau khi đặt hàng thành công
    await User.findByIdAndUpdate(userId, { cartData: {} });

    // Trả về kết quả thành công với thông tin đơn hàng đã tạo
    return res.status(201).json({
      data: {
        order: newOrder,
      },
      message: "Đặt hàng thành công",
      success: true,
    });
  } catch (_error) {
    // Xử lý lỗi server nếu có bất kỳ lỗi nào xảy ra
    return res.status(500).json({
      message: "Lỗi server khi đặt hàng. Vui lòng thử lại sau",
      success: false,
    });
  }
};

/**
 * Controller lấy danh sách tất cả đơn hàng (chỉ dành cho admin)
 * Lấy tất cả đơn hàng trong hệ thống và sắp xếp theo thời gian tạo mới nhất
 *
 * @param {Object} _req - Request object (không sử dụng trong hàm này)
 * @param {Object} res - Response object để trả về kết quả
 * @returns {Promise<Object>} JSON response chứa danh sách tất cả đơn hàng hoặc lỗi
 */
export const allOrders = async (_req, res) => {
  try {
    // Tìm tất cả đơn hàng và sắp xếp theo thời gian tạo giảm dần (mới nhất trước)
    const orders = await Order.find().sort({ createdAt: -1 });

    // Trả về danh sách đơn hàng thành công
    return res.status(200).json({
      data: {
        orders,
      },
      message: "Lấy danh sách tất cả đơn hàng thành công",
      success: true,
    });
  } catch (_error) {
    // Xử lý lỗi server nếu có bất kỳ lỗi nào xảy ra
    return res.status(500).json({
      message: "Lỗi server khi lấy danh sách đơn hàng. Vui lòng thử lại sau",
      success: false,
    });
  }
};

/**
 * Controller cập nhật trạng thái đơn hàng (chỉ dành cho admin)
 * Cập nhật trạng thái của đơn hàng theo ID được cung cấp
 *
 * @param {Object} req - Request object chứa orderId trong params và status trong body
 * @param {Object} res - Response object để trả về kết quả
 * @returns {Promise<Object>} JSON response chứa thông tin đơn hàng đã cập nhật hoặc lỗi
 */
export const updateStatus = async (req, res) => {
  try {
    // Lấy ID đơn hàng từ URL parameters
    const { orderId } = req.params;
    // Lấy trạng thái mới từ request body
    const { status } = req.body;

    // Kiểm tra ID đơn hàng có được cung cấp
    if (!orderId) {
      return res.status(400).json({
        message: "ID đơn hàng là bắt buộc",
        success: false,
      });
    }

    // Kiểm tra trạng thái phải là chuỗi hợp lệ
    if (!status || typeof status !== "string") {
      return res.status(400).json({
        message: "Trạng thái đơn hàng không hợp lệ",
        success: false,
      });
    }

    // Tìm và cập nhật đơn hàng theo ID, trả về document đã được cập nhật
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status }, // Chỉ cập nhật trường status
      { new: true } // Trả về document sau khi cập nhật thay vì document cũ
    );

    // Kiểm tra xem đơn hàng có tồn tại không
    if (!updatedOrder) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
        success: false,
      });
    }

    // Trả về kết quả thành công với thông tin đơn hàng đã cập nhật
    return res.status(200).json({
      data: {
        order: updatedOrder,
      },
      message: "Cập nhật trạng thái đơn hàng thành công",
      success: true,
    });
  } catch (_error) {
    // Xử lý lỗi khi ID đơn hàng không đúng định dạng MongoDB ObjectId
    if (_error.name === "CastError") {
      return res.status(400).json({
        message: "ID đơn hàng không hợp lệ",
        success: false,
      });
    }

    // Xử lý các lỗi server khác
    return res.status(500).json({
      message:
        "Lỗi server khi cập nhật trạng thái đơn hàng. Vui lòng thử lại sau",
      success: false,
    });
  }
};

/**
 * Controller lấy lịch sử đơn hàng của người dùng hiện tại
 * Lấy tất cả đơn hàng của người dùng đã đăng nhập và sắp xếp theo thời gian tạo mới nhất
 *
 * @param {Object} req - Request object chứa thông tin người dùng đã được xác thực
 * @param {Object} res - Response object để trả về kết quả
 * @returns {Promise<Object>} JSON response chứa danh sách đơn hàng của người dùng hoặc lỗi
 */
export const userOrders = async (req, res) => {
  try {
    // Lấy userId từ thông tin người dùng đã được xác thực (từ middleware userAuth)
    const userId = req.user?.userId;

    // Kiểm tra xác thực người dùng
    if (!userId) {
      return res.status(401).json({
        message: "Người dùng chưa được xác thực",
        success: false,
      });
    }

    // Tìm tất cả đơn hàng của người dùng và sắp xếp theo thời gian tạo giảm dần (mới nhất trước)
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    // Trả về danh sách đơn hàng thành công
    return res.status(200).json({
      data: {
        orders,
      },
      message: "Lấy lịch sử đơn hàng thành công",
      success: true,
    });
  } catch (_error) {
    // Xử lý lỗi server nếu có bất kỳ lỗi nào xảy ra
    return res.status(500).json({
      message: "Lỗi server khi lấy lịch sử đơn hàng. Vui lòng thử lại sau",
      success: false,
    });
  }
};
