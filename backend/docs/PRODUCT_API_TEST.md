# Tài liệu Test API Product - Postman

Tài liệu này hướng dẫn cách test các API liên quan đến quản lý sản phẩm (Product) cho hệ thống E-commerce.

## 1. Cấu hình chung

- **Base URL:** `http://localhost:4000` (Thay đổi tùy theo môi trường)
- **Content-Type:**
  - JSON: `application/json`
  - Form-data: `multipart/form-data` (cho upload ảnh)

---

## 2. Chi tiết các Endpoint

### A. Thêm sản phẩm mới (Add Product) - Chỉ Admin

- **URL:** `/api/product/add`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <admin_token>`
- **Body:** `form-data`
  - `name`: Tên sản phẩm (bắt buộc)
  - `price`: Giá sản phẩm (bắt buộc)
  - `description`: Mô tả sản phẩm (bắt buộc)
  - `category`: Danh mục sản phẩm (bắt buộc)
  - `subcategory`: Danh mục con (tùy chọn)
  - `sizes`: Kích thước, phân cách bằng dấu phẩy, ví dụ: "S,M,L,XL" (tùy chọn)
  - `bestseller`: true/false (tùy chọn, mặc định false)
  - `images`: File ảnh (bắt buộc, có thể upload nhiều ảnh, tối đa 10 ảnh)

**Ví dụ Body (form-data trong Postman):**

```
name: Áo thun nam
price: 299000
description: Áo thun nam chất liệu cotton mềm mại
category: quần áo
subcategory: áo thun
sizes: S,M,L,XL
bestseller: true
images: [chọn file ảnh 1]
images: [chọn file ảnh 2]
```

**Ví dụ Response JSON:**

```json
{
  "data": {
    "product": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Áo thun nam",
      "price": 299000,
      "description": "Áo thun nam chất liệu cotton mềm mại",
      "category": "quần áo",
      "subcategory": "áo thun",
      "images": [
        "https://res.cloudinary.com/.../image/upload/.../image1.jpg",
        "https://res.cloudinary.com/.../image/upload/.../image2.jpg"
      ],
      "sizes": ["S", "M", "L", "XL"],
      "bestseller": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Thêm sản phẩm thành công",
  "success": true
}
```

**Ghi chú:**

- Cần đăng nhập Admin trước để lấy token
- Chỉ cho phép upload file ảnh (jpg, jpeg, png, gif, webp)
- Kích thước file tối đa: 5MB
- Trong Postman: Chọn tab **Body** → **form-data** → Điền các field text và chọn file cho field `images`

### B. Lấy danh sách sản phẩm (List Products) - Public

- **URL:** `/api/product/list`
- **Method:** `GET`
- **Query Params (tùy chọn):**
  - `category`: Lọc theo danh mục, ví dụ: `?category=quần áo`
  - `subcategory`: Lọc theo danh mục con, ví dụ: `?subcategory=áo thun`
  - `bestseller`: Lọc sản phẩm bán chạy, ví dụ: `?bestseller=true`
  - `page`: Số trang (mặc định 1), ví dụ: `?page=2`
  - `limit`: Số sản phẩm mỗi trang (mặc định 20), ví dụ: `?limit=10`

**Ví dụ URL:**

```
GET /api/product/list
GET /api/product/list?category=quần áo&bestseller=true&page=1&limit=10
```

**Ví dụ Response JSON:**

```json
{
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Áo thun nam",
        "price": 299000,
        "description": "Áo thun nam chất liệu cotton mềm mại",
        "category": "quần áo",
        "subcategory": "áo thun",
        "images": ["https://res.cloudinary.com/.../image1.jpg"],
        "sizes": ["S", "M", "L", "XL"],
        "bestseller": true,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "limit": 20,
      "totalPages": 5,
      "totalProducts": 100
    }
  },
  "message": "Lấy danh sách sản phẩm thành công",
  "success": true
}
```

### C. Lấy chi tiết sản phẩm (Single Product) - Public

- **URL:** `/api/product/:productId`
- **Method:** `GET`
- **Params:**
  - `productId`: ID của sản phẩm (MongoDB ObjectId)

**Ví dụ URL:**

```
GET /api/product/507f1f77bcf86cd799439011
```

**Ví dụ Response JSON:**

```json
{
  "data": {
    "product": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Áo thun nam",
      "price": 299000,
      "description": "Áo thun nam chất liệu cotton mềm mại",
      "category": "quần áo",
      "subcategory": "áo thun",
      "images": [
        "https://res.cloudinary.com/.../image1.jpg",
        "https://res.cloudinary.com/.../image2.jpg"
      ],
      "sizes": ["S", "M", "L", "XL"],
      "bestseller": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Lấy chi tiết sản phẩm thành công",
  "success": true
}
```

### D. Xóa sản phẩm (Remove Product) - Chỉ Admin

- **URL:** `/api/product/:productId`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization: Bearer <admin_token>`
- **Params:**
  - `productId`: ID của sản phẩm (MongoDB ObjectId)

**Ví dụ URL:**

```
DELETE /api/product/507f1f77bcf86cd799439011
```

**Ví dụ Response JSON:**

```json
{
  "message": "Xóa sản phẩm thành công",
  "success": true
}
```

**Ghi chú:**

- Cần đăng nhập Admin trước để lấy token
- Sẽ xóa cả ảnh trên Cloudinary và dữ liệu trong MongoDB

---

## 3. Quy trình test

1. **Đăng nhập Admin** để lấy token:

   **URL:** `POST /api/user/admin`

   **Body (JSON):**

   ```json
   {
     "email": "admin@example.com",
     "password": "adminpassword"
   }
   ```

   **Response:**

   ```json
   {
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user": {
         "email": "admin@example.com",
         "role": "admin"
       }
     },
     "message": "Đăng nhập Admin thành công",
     "success": true
   }
   ```

   Copy `token` từ response để dùng cho các request Admin.

2. **Thêm sản phẩm:**

   - Sử dụng token ở bước 1 trong header `Authorization: Bearer <token>`
   - Chọn `form-data` trong Postman
   - Điền các field và chọn file ảnh
   - Gửi request

3. **Lấy danh sách sản phẩm:**

   - Không cần token (public endpoint)
   - Có thể thêm query params để filter

4. **Lấy chi tiết sản phẩm:**

   - Copy `productId` từ response của list products
   - Gửi request GET với productId

5. **Xóa sản phẩm:**
   - Sử dụng token Admin
   - Gửi request DELETE với productId
