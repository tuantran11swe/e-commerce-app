import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deleteImage, uploadImage } from "../config/cloudinary.js";
import Product from "../models/productModel.js";

// Lấy đường dẫn thư mục hiện tại (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Transform product object để convert createdAt từ Date sang timestamp number
 * Đảm bảo format nhất quán với dữ liệu mẫu frontend
 * @param {Object} product - Product object từ Mongoose hoặc plain object
 * @returns {Object} Product object với createdAt là timestamp number
 */
const transformProduct = (product) => {
  // Chuyển Mongoose document sang plain object nếu cần
  const productObj = product.toObject ? product.toObject() : { ...product };

  // Convert createdAt từ Date sang timestamp number
  let createdAtTimestamp = productObj.createdAt;
  if (productObj.createdAt instanceof Date) {
    createdAtTimestamp = productObj.createdAt.getTime();
  } else if (typeof productObj.createdAt === "string") {
    // Nếu là ISO string, convert sang timestamp
    createdAtTimestamp = new Date(productObj.createdAt).getTime();
  }

  return {
    ...productObj,
    createdAt: createdAtTimestamp,
    // Giữ virtual field date để tương thích
    date: createdAtTimestamp || productObj.date || Date.now(),
  };
};

/**
 * Thêm sản phẩm mới
 * Nhận dữ liệu text và file ảnh, upload ảnh lên Cloudinary, lưu vào MongoDB
 * @param {Object} req - Request object chứa thông tin sản phẩm và file ảnh
 * @param {Object} res - Response object để trả về kết quả
 * @returns {Promise<void>}
 */
export const addProduct = async (req, res) => {
  try {
    // Lấy thông tin sản phẩm từ body
    const {
      name,
      price,
      description,
      category,
      subcategory,
      sizes,
      bestseller,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !price || !description || !category) {
      return res.status(400).json({
        message:
          "Vui lòng điền đầy đủ thông tin bắt buộc (name, price, description, category)",
        success: false,
      });
    }

    // Kiểm tra xem có file ảnh được upload không
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Sản phẩm phải có ít nhất một hình ảnh",
        success: false,
      });
    }

    // Upload các ảnh lên Cloudinary
    const imageUrls = [];
    const uploadedFiles = [];

    for (const file of req.files) {
      try {
        // Upload ảnh lên Cloudinary từ đường dẫn file tạm thời
        const uploadResult = await uploadImage(file.path, "ecommerce/products");

        // Lưu URL của ảnh
        imageUrls.push(uploadResult.secure_url);

        // Lưu public_id để có thể xóa sau này nếu cần
        uploadedFiles.push({
          path: file.path,
          publicId: uploadResult.public_id,
        });
      } catch (uploadError) {
        console.error("Lỗi khi upload ảnh:", uploadError);

        // Xóa các file đã upload thành công trước đó nếu có lỗi
        for (const uploadedFile of uploadedFiles) {
          try {
            await deleteImage(uploadedFile.publicId);
            // Xóa file tạm thời
            if (fs.existsSync(uploadedFile.path)) {
              fs.unlinkSync(uploadedFile.path);
            }
          } catch (cleanupError) {
            console.error("Lỗi khi dọn dẹp file:", cleanupError);
          }
        }

        return res.status(500).json({
          message: "Lỗi khi upload ảnh lên Cloudinary. Vui lòng thử lại",
          success: false,
        });
      }
    }

    // Xử lý sizes nếu có (chuyển từ string sang array nếu cần)
    let sizesArray = [];
    if (sizes) {
      if (typeof sizes === "string") {
        // Nếu sizes là string, chuyển thành array
        sizesArray = sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean);
      } else if (Array.isArray(sizes)) {
        sizesArray = sizes;
      }
    }

    // Tạo object sản phẩm mới
    const newProduct = new Product({
      bestseller: bestseller === "true" || bestseller === true,
      category: category.trim(),
      description: description.trim(),
      images: imageUrls,
      name: name.trim(),
      price: Number(price),
      sizes: sizesArray,
      subcategory: subcategory ? subcategory.trim() : undefined,
    });

    // Lưu sản phẩm vào database
    await newProduct.save();

    // Xóa các file tạm thời sau khi upload thành công
    for (const file of req.files) {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (deleteError) {
        console.error("Lỗi khi xóa file tạm thời:", deleteError);
      }
    }

    // Transform createdAt từ Date sang timestamp number
    const transformedProduct = transformProduct(newProduct);

    // Trả về kết quả thành công
    res.status(201).json({
      data: {
        product: transformedProduct,
      },
      message: "Thêm sản phẩm thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);

    // Xóa các file tạm thời nếu có lỗi
    if (req.files) {
      for (const file of req.files) {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (deleteError) {
          console.error("Lỗi khi xóa file tạm thời:", deleteError);
        }
      }
    }

    // Xử lý lỗi validation từ Mongoose
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: errors.join(", "),
        success: false,
      });
    }

    res.status(500).json({
      message: "Lỗi server khi thêm sản phẩm. Vui lòng thử lại sau",
      success: false,
    });
  }
};

/**
 * Lấy danh sách tất cả sản phẩm
 * @param {Object} req - Request object (có thể chứa query params để filter)
 * @param {Object} res - Response object để trả về kết quả
 * @returns {Promise<void>}
 */
export const listProducts = async (req, res) => {
  try {
    // Lấy các query params để filter (nếu có)
    const {
      category,
      subcategory,
      bestseller,
      page = 1,
      limit = 20,
    } = req.query;

    // Xây dựng query filter
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    if (bestseller !== undefined) {
      filter.bestseller = bestseller === "true" || bestseller === true;
    }

    // Tính toán pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Lấy danh sách sản phẩm từ database
    const products = await Product.find(filter)
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
      .skip(skip)
      .limit(limitNumber);

    // Đếm tổng số sản phẩm (để phân trang)
    const totalProducts = await Product.countDocuments(filter);

    // Transform createdAt từ Date sang timestamp number cho mỗi product
    const transformedProducts = products.map((product) =>
      transformProduct(product),
    );

    // Trả về kết quả
    res.status(200).json({
      data: {
        pagination: {
          currentPage: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalProducts / limitNumber),
          totalProducts,
        },
        products: transformedProducts,
      },
      message: "Lấy danh sách sản phẩm thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    res.status(500).json({
      message: "Lỗi server khi lấy danh sách sản phẩm. Vui lòng thử lại sau",
      success: false,
    });
  }
};

/**
 * Lấy chi tiết một sản phẩm theo ID
 * @param {Object} req - Request object chứa productId trong params
 * @param {Object} res - Response object để trả về kết quả
 * @returns {Promise<void>}
 */
export const singleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Kiểm tra xem có productId không
    if (!productId) {
      return res.status(400).json({
        message: "ID sản phẩm là bắt buộc",
        success: false,
      });
    }

    // Tìm sản phẩm theo ID
    const product = await Product.findById(productId);

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
        success: false,
      });
    }

    // Transform createdAt từ Date sang timestamp number
    const transformedProduct = transformProduct(product);

    // Trả về chi tiết sản phẩm
    res.status(200).json({
      data: {
        product: transformedProduct,
      },
      message: "Lấy chi tiết sản phẩm thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sản phẩm:", error);

    // Xử lý lỗi ID không hợp lệ
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "ID sản phẩm không hợp lệ",
        success: false,
      });
    }

    res.status(500).json({
      message: "Lỗi server khi lấy chi tiết sản phẩm. Vui lòng thử lại sau",
      success: false,
    });
  }
};

/**
 * Xóa sản phẩm theo ID
 * Xóa cả ảnh trên Cloudinary và dữ liệu trong MongoDB
 * @param {Object} req - Request object chứa productId trong params
 * @param {Object} res - Response object để trả về kết quả
 * @returns {Promise<void>}
 */
export const removeProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Kiểm tra xem có productId không
    if (!productId) {
      return res.status(400).json({
        message: "ID sản phẩm là bắt buộc",
        success: false,
      });
    }

    // Tìm sản phẩm theo ID
    const product = await Product.findById(productId);

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
        success: false,
      });
    }

    // Xóa các ảnh trên Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          // Lấy public_id từ URL Cloudinary
          // Format URL: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
          const urlParts = imageUrl.split("/");
          const uploadIndex = urlParts.indexOf("upload");
          if (uploadIndex !== -1 && uploadIndex < urlParts.length - 1) {
            // Lấy phần sau "upload/" và trước extension
            const versionAndPublicId = urlParts
              .slice(uploadIndex + 1)
              .join("/");
            // Loại bỏ extension và version nếu có
            const publicId = versionAndPublicId
              .replace(/^v\d+\//, "")
              .replace(/\.[^.]+$/, "");

            // Xóa ảnh trên Cloudinary
            await deleteImage(publicId);
          }
        } catch (deleteImageError) {
          console.error("Lỗi khi xóa ảnh trên Cloudinary:", deleteImageError);
          // Tiếp tục xóa sản phẩm dù có lỗi xóa ảnh
        }
      }
    }

    // Xóa sản phẩm khỏi database
    await Product.findByIdAndDelete(productId);

    // Trả về kết quả thành công
    res.status(200).json({
      message: "Xóa sản phẩm thành công",
      success: true,
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);

    // Xử lý lỗi ID không hợp lệ
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "ID sản phẩm không hợp lệ",
        success: false,
      });
    }

    res.status(500).json({
      message: "Lỗi server khi xóa sản phẩm. Vui lòng thử lại sau",
      success: false,
    });
  }
};
