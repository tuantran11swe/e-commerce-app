# Tài liệu Test API User - Postman

Tài liệu này hướng dẫn cách test các API liên quan đến người dùng (User) và Admin cho hệ thống E-commerce.

## 1. Cấu hình chung

- **Base URL:** `http://localhost:4000` (Thay đổi tùy theo môi trường)
- **Content-Type:** `application/json`

---

## 2. Chi tiết các Endpoint

### A. Đăng ký người dùng (Register)

- **URL:** `/api/user/register`
- **Method:** `POST`
- **Body:**

```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "123456"
}
```

- **Ghi chú:** Password phải từ 6 ký tự trở lên.

### B. Đăng nhập người dùng (Login)

- **URL:** `/api/user/login`
- **Method:** `POST`
- **Body:**

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### C. Đăng nhập Admin (Admin Login)

- **URL:** `/api/user/admin`
- **Method:** `POST`
- **Body:**

```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

- **Ghi chú:** Email và Password phải khớp với biến môi trường `ADMIN_EMAIL` và `ADMIN_PASSWORD` trong file `.env`.

---
