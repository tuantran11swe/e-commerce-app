# Hướng dẫn Testing

## Cài đặt

Các dependencies đã được cài đặt trong `package.json`:
- `vitest`: Testing framework
- `@testing-library/react`: Testing utilities cho React
- `@testing-library/jest-dom`: Matchers cho DOM
- `@testing-library/user-event`: Simulate user interactions
- `jsdom`: DOM environment cho testing

## Chạy Test

```bash
# Chạy tất cả test
npm test

# Chạy test với UI
npm run test:ui

# Chạy test với coverage
npm run test:coverage

# Chạy test ở watch mode
npm test -- --watch
```

## Cấu trúc Test

Các test được tổ chức theo cấu trúc thư mục giống với source code:

```
src/
├── context/
│   └── __tests__/
│       └── ShopContextProvider.test.jsx
├── components/
│   └── __tests__/
│       ├── Navbar.test.jsx
│       ├── SearchBar.test.jsx
│       └── CartTotal.test.jsx
├── pages/
│   └── __tests__/
│       ├── Cart.test.jsx
│       └── Product.test.jsx
└── test/
    ├── setup.js          # Setup file cho Vitest
    └── utils.jsx         # Helper functions cho testing
```

## Test Coverage

Các chức năng đã được test:

### ShopContextProvider
- ✅ formatPrice: Format giá theo định dạng Việt Nam
- ✅ addToCart: Thêm sản phẩm vào giỏ hàng
- ✅ getCartCount: Tính tổng số lượng sản phẩm
- ✅ getCartAmount: Tính tổng tiền sản phẩm
- ✅ updateQuantity: Cập nhật số lượng sản phẩm
- ✅ search và showSearch: Quản lý state tìm kiếm

### Components
- ✅ Navbar: Navigation bar với menu mobile
- ✅ SearchBar: Thanh tìm kiếm
- ✅ CartTotal: Hiển thị tổng tiền giỏ hàng

### Pages
- ✅ Cart: Trang giỏ hàng
- ✅ Product: Trang chi tiết sản phẩm

## Best Practices

1. **Test naming**: Sử dụng tiếng Việt với format "nên [mô tả hành vi]"
2. **Arrange-Act-Assert**: Tổ chức test theo pattern AAA
3. **Isolation**: Mỗi test độc lập, không phụ thuộc vào test khác
4. **Mocking**: Mock các dependencies bên ngoài như toast, router
5. **Accessibility**: Test với screen readers và keyboard navigation
