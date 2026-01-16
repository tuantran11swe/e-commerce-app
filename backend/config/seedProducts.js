import path from "node:path";
import { fileURLToPath } from "node:url";
import Product from "../models/productModel.js";
import { uploadImage } from "./cloudinary.js";

// Lấy __dirname trong ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dữ liệu sản phẩm mẫu từ frontend_assets
 * Đây là bản sao của dữ liệu từ frontend_assets/assets.js
 */
const sampleProducts = [
  {
    _id: "aaaaa",
    bestseller: true,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img1.png",
    name: "Áo Cotton Cổ Tròn Nữ",
    price: 150000,
    sizes: ["S", "M", "L"],
    subcategory: "Áo",
  },
  {
    _id: "aaaab",
    bestseller: true,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    images: ["p_img2_1.png", "p_img2_2.png", "p_img2_3.png", "p_img2_4.png"],
    name: "Áo Thun Cotton Nguyên Chất Nam",
    price: 280000,
    sizes: ["M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaac",
    bestseller: true,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img3.png",
    name: "Áo Cotton Cổ Tròn Bé Gái",
    price: 180000,
    sizes: ["S", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaad",
    bestseller: true,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img4.png",
    name: "Áo Thun Cotton Nguyên Chất Nam",
    price: 180000,
    sizes: ["S", "M", "XXL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaae",
    bestseller: true,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img5.png",
    name: "Áo Cotton Cổ Tròn Nữ",
    price: 220000,
    sizes: ["M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaaf",
    bestseller: true,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img6.png",
    name: "Áo Cotton Cổ Tròn Bé Gái",
    price: 160000,
    sizes: ["S", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaag",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img7.png",
    name: "Quần Tây Nam Ôm Vừa Mặt Phẳng",
    price: 380000,
    sizes: ["S", "L", "XL"],
    subcategory: "Quần",
  },
  {
    _id: "aaaah",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img8.png",
    name: "Áo Thun Cotton Nguyên Chất Nam",
    price: 240000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaai",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img9.png",
    name: "Áo Cotton Cổ Tròn Bé Gái",
    price: 120000,
    sizes: ["M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaaj",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img10.png",
    name: "Quần Tây Nam Ôm Vừa Mặt Phẳng",
    price: 320000,
    sizes: ["S", "L", "XL"],
    subcategory: "Quần",
  },
  {
    _id: "aaaak",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img11.png",
    name: "Áo Thun Cotton Nguyên Chất Nam",
    price: 200000,
    sizes: ["S", "M", "L"],
    subcategory: "Áo",
  },
  {
    _id: "aaaal",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img12.png",
    name: "Áo Thun Cotton Nguyên Chất Nam",
    price: 260000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaam",
    bestseller: false,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img13.png",
    name: "Áo Cotton Cổ Tròn Nữ",
    price: 220000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaan",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img14.png",
    name: "Áo Thun Cotton Nguyên Chất Bé Trai",
    price: 280000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaao",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img15.png",
    name: "Quần Tây Nam Ôm Vừa Mặt Phẳng",
    price: 360000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Quần",
  },
  {
    _id: "aaaap",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img16.png",
    name: "Áo Cotton Cổ Tròn Bé Gái",
    price: 220000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaaq",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img17.png",
    name: "Quần Tây Nam Ôm Vừa Mặt Phẳng",
    price: 400000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Quần",
  },
  {
    _id: "aaaar",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img18.png",
    name: "Áo Thun Cotton Nguyên Chất Bé Trai",
    price: 320000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaas",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img19.png",
    name: "Áo Thun Cotton Nguyên Chất Bé Trai",
    price: 280000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaat",
    bestseller: false,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img20.png",
    name: "Quần Palazzo Nữ Có Thắt Lưng",
    price: 420000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Quần",
  },
  {
    _id: "aaaau",
    bestseller: false,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img21.png",
    name: "Áo Khoác Nữ Có Khóa Phía Trước Kiểu Rộng",
    price: 550000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Đồ mùa đông",
  },
  {
    _id: "aaaav",
    bestseller: false,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img22.png",
    name: "Quần Palazzo Nữ Có Thắt Lưng",
    price: 450000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Quần",
  },
  {
    _id: "aaaaw",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img23.png",
    name: "Áo Thun Cotton Nguyên Chất Bé Trai",
    price: 320000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaax",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img24.png",
    name: "Áo Thun Cotton Nguyên Chất Bé Trai",
    price: 280000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaay",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img25.png",
    name: "Áo Cotton Cổ Tròn Bé Gái",
    price: 250000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaaaz",
    bestseller: false,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img26.png",
    name: "Áo Khoác Nữ Có Khóa Phía Trước Kiểu Rộng",
    price: 600000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Đồ mùa đông",
  },
  {
    _id: "aaaba",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img27.png",
    name: "Áo Cotton Cổ Tròn Bé Gái",
    price: 270000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaabb",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img28.png",
    name: "Áo Khoác Denim Nam Ôm Vừa Kiểu Rộng",
    price: 650000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Đồ mùa đông",
  },
  {
    _id: "aaabc",
    bestseller: false,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img29.png",
    name: "Áo Cotton Cổ Tròn Nữ",
    price: 320000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaabd",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img30.png",
    name: "Áo Cotton Cổ Tròn Bé Gái",
    price: 290000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaabe",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img31.png",
    name: "Áo Thun Cotton Nguyên Chất Nam",
    price: 350000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaabf",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img32.png",
    name: "Áo Thun Cotton Nguyên Chất Nam",
    price: 380000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaabg",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img33.png",
    name: "Áo Cotton Cổ Tròn Bé Gái",
    price: 300000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaabh",
    bestseller: false,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img34.png",
    name: "Áo Cotton Cổ Tròn Nữ",
    price: 360000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaabi",
    bestseller: false,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img35.png",
    name: "Áo Khoác Nữ Có Khóa Phía Trước Kiểu Rộng",
    price: 620000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Đồ mùa đông",
  },
  {
    _id: "aaabj",
    bestseller: false,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img36.png",
    name: "Áo Khoác Nữ Có Khóa Phía Trước Kiểu Rộng",
    price: 680000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Đồ mùa đông",
  },
  {
    _id: "aaabk",
    bestseller: false,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img37.png",
    name: "Áo Cotton Cổ Tròn Nữ",
    price: 340000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaabl",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img38.png",
    name: "Áo Thun Cotton Nguyên Chất Nam",
    price: 400000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaabm",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img39.png",
    name: "Áo Sơ Mi Cotton In Hoa Nam",
    price: 390000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaabn",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img40.png",
    name: "Áo Khoác Denim Nam Ôm Vừa Kiểu Rộng",
    price: 540000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Đồ mùa đông",
  },
  {
    _id: "aaabo",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img41.png",
    name: "Áo Thun Cotton Nguyên Chất Nam",
    price: 370000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaabp",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img42.png",
    name: "Áo Thun Cotton Nguyên Chất Bé Trai",
    price: 300000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Áo",
  },
  {
    _id: "aaabq",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img43.png",
    name: "Quần Tây Trẻ Em Ôm Vừa",
    price: 350000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Quần",
  },
  {
    _id: "aaabr",
    bestseller: false,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img44.png",
    name: "Áo Khoác Nữ Có Khóa Phía Trước Kiểu Rộng",
    price: 750000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Đồ mùa đông",
  },
  {
    _id: "aaabs",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img45.png",
    name: "Áo Khoác Denim Nam Ôm Vừa Kiểu Rộng",
    price: 540000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Đồ mùa đông",
  },
  {
    _id: "aaabt",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img46.png",
    name: "Áo Khoác Denim Nam Ôm Vừa Kiểu Rộng",
    price: 780000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Đồ mùa đông",
  },
  {
    _id: "aaabu",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img47.png",
    name: "Quần Tây Trẻ Em Ôm Vừa",
    price: 380000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Quần",
  },
  {
    _id: "aaabv",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img48.png",
    name: "Áo Khoác Denim Nam Ôm Vừa Kiểu Rộng",
    price: 800000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Đồ mùa đông",
  },
  {
    _id: "aaabw",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img49.png",
    name: "Quần Tây Trẻ Em Ôm Vừa",
    price: 400000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Quần",
  },
  {
    _id: "aaabx",
    bestseller: false,
    category: "Trẻ em",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img50.png",
    name: "Quần Tây Trẻ Em Ôm Vừa",
    price: 390000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Quần",
  },
  {
    _id: "aaaby",
    bestseller: false,
    category: "Nữ",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img51.png",
    name: "Áo Khoác Nữ Có Khóa Phía Trước Kiểu Rộng",
    price: 600000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Đồ mùa đông",
  },
  {
    _id: "aaabz",
    bestseller: false,
    category: "Nam",
    description:
      "Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn, có thể mặc làm áo lót hoặc áo ngoài.",
    image: "p_img52.png",
    name: "Áo Khoác Denim Nam Ôm Vừa Kiểu Rộng",
    price: 750000,
    sizes: ["S", "M", "L", "XL"],
    subcategory: "Đồ mùa đông",
  },
];

export const seedProducts = async () => {
  try {
    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (!isCloudinaryConfigured) {
      console.log(
        "Bỏ qua seed dữ liệu sản phẩm vì Cloudinary chưa được cấu hình đầy đủ",
      );
      return;
    }

    // Kiểm tra số lượng sản phẩm hiện có
    const productCount = await Product.countDocuments();

    if (productCount > 0) {
      console.log(
        `✓ Database đã có ${productCount} sản phẩm. Bỏ qua việc seed data.`,
      );
      return;
    }

    console.log("⏳ Bắt đầu seed dữ liệu sản phẩm...");

    // Đường dẫn đến thư mục chứa ảnh
    const imagesDir = path.join(__dirname, "..", "frontend_assets");

    let successCount = 0;
    let errorCount = 0;

    // Xử lý từng sản phẩm
    for (const product of sampleProducts) {
      try {
        // Xử lý upload ảnh
        const imageUrls = [];

        // Xử lý trường hợp có nhiều ảnh (images array) hoặc 1 ảnh (image string)
        const imageFiles = product.images || [product.image];

        for (const imageFile of imageFiles) {
          const imagePath = path.join(imagesDir, imageFile);

          // Upload ảnh lên Cloudinary
          const uploadResult = await uploadImage(imagePath, "products");
          imageUrls.push(uploadResult.secure_url);
        }

        // Tạo sản phẩm mới trong database
        await Product.create({
          bestseller: product.bestseller,
          category: product.category,
          description: product.description,
          images: imageUrls,
          name: product.name,
          price: product.price,
          sizes: product.sizes,
          subcategory: product.subcategory,
        });

        successCount++;
        console.log(`  ✓ Đã thêm: ${product.name}`);
      } catch (error) {
        errorCount++;
        console.error(`  ✗ Lỗi khi thêm ${product.name}:`, error.message);
      }
    }

    console.log(`\n${"=".repeat(50)}`);
    console.log(`✓ Hoàn thành seed data!`);
    console.log(`  - Thành công: ${successCount} sản phẩm`);
    console.log(`  - Thất bại: ${errorCount} sản phẩm`);
    console.log(`${"=".repeat(50)}\n`);
  } catch (error) {
    console.error("✗ Lỗi khi seed dữ liệu sản phẩm:", error);
    throw error;
  }
};
