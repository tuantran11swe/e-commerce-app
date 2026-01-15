import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/userModel.js";

/**
 * Đăng ký người dùng mới
 * @param {Object} req - Request object chứa email, password, name
 * @param {Object} res - Response object để trả về kết quả
 * @returns {Promise<void>}
 */
export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Vui lòng điền đầy đủ thông tin (email, password, name)",
        success: false,
      });
    }

    // Validate định dạng email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Email không đúng định dạng",
        success: false,
      });
    }

    // Validate độ dài mật khẩu (tối thiểu 6 ký tự)
    if (password.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 6 ký tự",
        success: false,
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: "Email đã được sử dụng. Vui lòng chọn email khác",
        success: false,
      });
    }

    // Tạo user mới (password sẽ được hash tự động bởi pre-save hook trong model)
    const newUser = new User({
      email: email.toLowerCase(),
      name: name.trim(),
      password, // Sẽ được hash tự động trong pre-save hook
    });

    // Lưu user vào database
    await newUser.save();

    // Tạo JWT token cho user mới đăng ký
    const token = jwt.sign(
      { email: newUser.email, userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Token hết hạn sau 7 ngày
    );

    // Trả về thông tin user và token (không bao gồm password)
    res.status(201).json({
      data: {
        token,
        user: {
          email: newUser.email,
          id: newUser._id,
          name: newUser.name,
        },
      },
      message: "Đăng ký thành công",
      success: true,
    });
  } catch (error) {
    // Xử lý lỗi validation từ Mongoose
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        errors,
        message: "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    // Xử lý lỗi duplicate key (email trùng)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email đã được sử dụng. Vui lòng chọn email khác",
        success: false,
      });
    }

    // Xử lý các lỗi khác
    console.error("Lỗi khi đăng ký user:", error);
    res.status(500).json({
      message: "Lỗi server khi đăng ký. Vui lòng thử lại sau",
      success: false,
    });
  }
};

/**
 * Đăng nhập người dùng
 * @param {Object} req - Request object chứa email và password
 * @param {Object} res - Response object để trả về kết quả
 * @returns {Promise<void>}
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập email và mật khẩu",
        success: false,
      });
    }

    // Tìm user theo email (select password để so sánh)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    // Kiểm tra email có tồn tại không
    if (!user) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không chính xác",
        success: false,
      });
    }

    // So sánh mật khẩu người dùng nhập với mật khẩu đã hash trong database
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không chính xác",
        success: false,
      });
    }

    // Tạo JWT token cho user đăng nhập thành công
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Token hết hạn sau 7 ngày
    );

    // Trả về thông tin user và token (không bao gồm password)
    res.status(200).json({
      data: {
        token,
        user: {
          email: user.email,
          id: user._id,
          name: user.name,
        },
      },
      message: "Đăng nhập thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập user:", error);
    res.status(500).json({
      message: "Lỗi server khi đăng nhập. Vui lòng thử lại sau",
      success: false,
    });
  }
};

/**
 * Đăng nhập Admin
 * So sánh email và password với thông tin Admin được lưu trong biến môi trường
 * @param {Object} req - Request object chứa email và password
 * @param {Object} res - Response object để trả về kết quả
 * @returns {Promise<void>}
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập email và mật khẩu",
        success: false,
      });
    }

    // Lấy thông tin Admin từ biến môi trường
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Kiểm tra xem biến môi trường đã được cấu hình chưa
    if (!adminEmail || !adminPassword) {
      console.error("Lỗi: ADMIN_EMAIL hoặc ADMIN_PASSWORD chưa được cấu hình");
      return res.status(500).json({
        message: "Lỗi cấu hình server. Vui lòng liên hệ quản trị viên",
        success: false,
      });
    }

    // So sánh email và password với thông tin Admin
    const isEmailMatch = email.toLowerCase() === adminEmail.toLowerCase();
    const isPasswordMatch = password === adminPassword;

    if (!isEmailMatch || !isPasswordMatch) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu Admin không chính xác",
        success: false,
      });
    }

    // Tạo JWT token cho Admin (có thể thêm role: 'admin' vào payload)
    const token = jwt.sign(
      { email: adminEmail, role: "admin", userId: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Token hết hạn sau 7 ngày
    );

    // Trả về token cho Admin
    res.status(200).json({
      data: {
        token,
        user: {
          email: adminEmail,
          role: "admin",
        },
      },
      message: "Đăng nhập Admin thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập Admin:", error);
    res.status(500).json({
      message: "Lỗi server khi đăng nhập Admin. Vui lòng thử lại sau",
      success: false,
    });
  }
};
