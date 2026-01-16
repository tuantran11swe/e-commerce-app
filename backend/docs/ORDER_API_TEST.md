# Tài liệu Test API Order - Postman

Tài liệu này hướng dẫn cách test các API liên quan đến quản lý đơn hàng (Order) cho hệ thống E-commerce.

## 1. Cấu hình chung

- **Base URL:** `http://localhost:4000` (Thay đổi tùy theo môi trường)
- **Content-Type:** `application/json`

---

## 2. Chi tiết các Endpoint

### A. Đặt đơn hàng (COD) - Người dùng

- **URL:** `/api/order/place`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer <user_token>`
  - `Content-Type: application/json`
- **Body:**

```json
{
  "items": [
    {
      "productId": "65f0c1e2a1234567890abcde",
      "quantity": 2,
      "size": "M"
    },
    {
      "productId": "65f0c1e2a1234567890abcef",
      "quantity": 1,
      "size": "L"
    }
  ],
  "amount": 750000,
  "address": {
    "fullName": "Nguyen Van A",
    "phone": "0900000000",
    "street": "Số 1, đường ABC",
    "ward": "Phường XYZ",
    "district": "Quận 1",
    "city": "TP.HCM"
  },
  "paymentMethod": "COD"
}
```

- **Ghi chú:**

  - `items` là danh sách sản phẩm trong giỏ hàng.
  - `amount` là tổng tiền đơn hàng (có thể lấy từ frontend).
  - `address` là thông tin giao hàng, có thể tùy biến thêm field.
  - `paymentMethod`: hiện tại backend mặc định `"COD"` nếu không truyền.
  - Sau khi đặt hàng thành công, giỏ hàng của user sẽ được làm trống.

- **Ví dụ Response JSON (201):**

```json
{
  "data": {
    "order": {
      "_id": "65f0c5d3a1234567890abcd0",
      "userId": "65f0c123a1234567890aaaaa",
      "items": [
        {
          "productId": "65f0c1e2a1234567890abcde",
          "quantity": 2,
          "size": "M"
        }
      ],
      "amount": 750000,
      "address": {
        "fullName": "Nguyen Van A",
        "phone": "0900000000",
        "street": "Số 1, đường ABC",
        "ward": "Phường XYZ",
        "district": "Quận 1",
        "city": "TP.HCM"
      },
      "status": "Đang xử lý",
      "paymentMethod": "COD",
      "payment": false,
      "createdAt": "2026-01-16T10:00:00.000Z",
      "updatedAt": "2026-01-16T10:00:00.000Z",
      "date": 1768624800000
    }
  },
  "message": "Đặt hàng thành công",
  "success": true
}
```

---

### B. Lịch sử đơn hàng của người dùng

- **URL:** `/api/order/user`
- **Method:** `GET`
- **Headers:**

  - `Authorization: Bearer <user_token>`

- **Ví dụ URL:**

```
GET /api/order/user
```

- **Ví dụ Response JSON (200):**

```json
{
  "data": {
    "orders": [
      {
        "_id": "65f0c5d3a1234567890abcd0",
        "userId": "65f0c123a1234567890aaaaa",
        "items": [
          {
            "productId": "65f0c1e2a1234567890abcde",
            "quantity": 2,
            "size": "M"
          }
        ],
        "amount": 750000,
        "address": {
          "fullName": "Nguyen Van A",
          "phone": "0900000000",
          "street": "Số 1, đường ABC",
          "ward": "Phường XYZ",
          "district": "Quận 1",
          "city": "TP.HCM"
        },
        "status": "Đang xử lý",
        "paymentMethod": "COD",
        "payment": false,
        "createdAt": "2026-01-16T10:00:00.000Z",
        "updatedAt": "2026-01-16T10:00:00.000Z",
        "date": 1768624800000
      }
    ]
  },
  "message": "Lấy lịch sử đơn hàng thành công",
  "success": true
}
```

---

### C. Lấy tất cả đơn hàng - Chỉ Admin

- **URL:** `/api/order/all`
- **Method:** `GET`
- **Headers:**

  - `Authorization: Bearer <admin_token>`

- **Ví dụ URL:**

```
GET /api/order/all
```

- **Ví dụ Response JSON (200):**

```json
{
  "data": {
    "orders": [
      {
        "_id": "65f0c5d3a1234567890abcd0",
        "userId": "65f0c123a1234567890aaaaa",
        "items": [
          {
            "productId": "65f0c1e2a1234567890abcde",
            "quantity": 2,
            "size": "M"
          }
        ],
        "amount": 750000,
        "address": {
          "fullName": "Nguyen Van A",
          "phone": "0900000000",
          "street": "Số 1, đường ABC",
          "ward": "Phường XYZ",
          "district": "Quận 1",
          "city": "TP.HCM"
        },
        "status": "Đang xử lý",
        "paymentMethod": "COD",
        "payment": false,
        "createdAt": "2026-01-16T10:00:00.000Z",
        "updatedAt": "2026-01-16T10:00:00.000Z",
        "date": 1768624800000
      }
    ]
  },
  "message": "Lấy danh sách tất cả đơn hàng thành công",
  "success": true
}
```

---

### D. Cập nhật trạng thái đơn hàng - Chỉ Admin

- **URL:** `/api/order/:orderId/status`
- **Method:** `PUT`
- **Headers:**
  - `Authorization: Bearer <admin_token>`
  - `Content-Type: application/json`
- **Params:**
  - `orderId`: ID của đơn hàng (MongoDB ObjectId)
- **Body:**

```json
{
  "status": "Đang giao hàng"
}
```

- **Ví dụ URL:**

```
PUT /api/order/65f0c5d3a1234567890abcd0/status
```

- **Ví dụ Response JSON (200):**

```json
{
  "data": {
    "order": {
      "_id": "65f0c5d3a1234567890abcd0",
      "userId": "65f0c123a1234567890aaaaa",
      "items": [
        {
          "productId": "65f0c1e2a1234567890abcde",
          "quantity": 2,
          "size": "M"
        }
      ],
      "amount": 750000,
      "address": {
        "fullName": "Nguyen Van A",
        "phone": "0900000000",
        "street": "Số 1, đường ABC",
        "ward": "Phường XYZ",
        "district": "Quận 1",
        "city": "TP.HCM"
      },
      "status": "Đang giao hàng",
      "paymentMethod": "COD",
      "payment": false,
      "createdAt": "2026-01-16T10:00:00.000Z",
      "updatedAt": "2026-01-16T10:10:00.000Z",
      "date": 1768624800000
    }
  },
  "message": "Cập nhật trạng thái đơn hàng thành công",
  "success": true
}
```

- **Ghi chú:**
  - Cần đăng nhập Admin để lấy token.
  - `status` nên tuân theo các giá trị bạn định nghĩa trong hệ thống, ví dụ:
    - `"Đang xử lý"`, `"Đang đóng gói"`, `"Đang giao hàng"`, `"Hoàn thành"`, `"Đã hủy"`.

---
