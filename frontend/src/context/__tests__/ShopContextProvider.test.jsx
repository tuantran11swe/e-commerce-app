import { renderHook } from "@testing-library/react";
import { act, useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { describe, expect, it, vi } from "vitest";
import { ShopContext } from "../ShopContext";
import ShopContextProvider from "../ShopContextProvider";

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Helper function để render hook với context provider
function renderShopContextHook() {
  const wrapper = ({ children }) => (
    <BrowserRouter>
      <ShopContextProvider>{children}</ShopContextProvider>
    </BrowserRouter>
  );

  return renderHook(
    () => {
      return useContext(ShopContext);
    },
    { wrapper },
  );
}

describe("ShopContextProvider", () => {
  describe("formatPrice", () => {
    it("nên format giá đúng định dạng Việt Nam với dấu chấm phân cách hàng nghìn", () => {
      const { result } = renderShopContextHook();

      expect(result.current.formatPrice(150000)).toBe("150.000 ₫");
      expect(result.current.formatPrice(1000)).toBe("1.000 ₫");
      expect(result.current.formatPrice(1000000)).toBe("1.000.000 ₫");
      expect(result.current.formatPrice(50000)).toBe("50.000 ₫");
    });

    it("nên xử lý giá bằng 0", () => {
      const { result } = renderShopContextHook();

      expect(result.current.formatPrice(0)).toBe("0 ₫");
    });
  });

  describe("addToCart", () => {
    it("nên hiển thị lỗi khi chưa chọn size", () => {
      const { result } = renderShopContextHook();

      act(() => {
        result.current.addToCart("aaaaa", "");
      });

      expect(toast.error).toHaveBeenCalledWith("Vui lòng chọn kích thước");
    });

    it("nên thêm sản phẩm mới vào giỏ hàng", () => {
      const { result } = renderShopContextHook();

      act(() => {
        result.current.addToCart("aaaaa", "M");
      });

      expect(result.current.cartItems).toEqual({
        aaaaa: { M: 1 },
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Áo Cotton Cổ Tròn Nữ (Size: M) đã được thêm vào giỏ hàng!",
      );
    });

    it("nên tăng số lượng khi thêm sản phẩm đã có trong giỏ hàng với cùng size", () => {
      const { result } = renderShopContextHook();

      act(() => {
        result.current.addToCart("aaaaa", "M");
      });

      act(() => {
        result.current.addToCart("aaaaa", "M");
      });

      expect(result.current.cartItems).toEqual({
        aaaaa: { M: 2 },
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Áo Cotton Cổ Tròn Nữ (Size: M) - Số lượng: 2",
      );
    });

    it("nên thêm size mới cho sản phẩm đã có trong giỏ hàng", () => {
      const { result } = renderShopContextHook();

      act(() => {
        result.current.addToCart("aaaaa", "M");
      });

      act(() => {
        result.current.addToCart("aaaaa", "L");
      });

      expect(result.current.cartItems).toEqual({
        aaaaa: { L: 1, M: 1 },
      });
    });
  });

  describe("getCartCount", () => {
    it("nên trả về 0 khi giỏ hàng trống", () => {
      const { result } = renderShopContextHook();

      expect(result.current.getCartCount()).toBe(0);
    });

    it("nên tính đúng tổng số lượng sản phẩm trong giỏ hàng", () => {
      const { result } = renderShopContextHook();

      act(() => {
        result.current.addToCart("aaaaa", "M");
        result.current.addToCart("aaaaa", "M");
        result.current.addToCart("aaaaa", "L");
        result.current.addToCart("aaaab", "M");
      });

      expect(result.current.getCartCount()).toBe(4);
    });
  });

  describe("getCartAmount", () => {
    it("nên trả về 0 khi giỏ hàng trống", () => {
      const { result } = renderShopContextHook();

      expect(result.current.getCartAmount()).toBe(0);
    });

    it("nên tính đúng tổng tiền các sản phẩm trong giỏ hàng", () => {
      const { result } = renderShopContextHook();

      act(() => {
        result.current.addToCart("aaaaa", "M"); // 150000
        result.current.addToCart("aaaaa", "M"); // +150000
        result.current.addToCart("aaaab", "M"); // +280000
      });

      expect(result.current.getCartAmount()).toBe(580000);
    });
  });

  describe("updateQuantity", () => {
    it("nên cập nhật số lượng sản phẩm trong giỏ hàng", () => {
      const { result } = renderShopContextHook();

      act(() => {
        result.current.addToCart("aaaaa", "M");
      });

      act(() => {
        result.current.updateQuantity("aaaaa", "M", 5);
      });

      expect(result.current.cartItems).toEqual({
        aaaaa: { M: 5 },
      });
    });

    it("nên xóa sản phẩm khi đặt số lượng về 0", () => {
      const { result } = renderShopContextHook();

      act(() => {
        result.current.addToCart("aaaaa", "M");
      });

      act(() => {
        result.current.updateQuantity("aaaaa", "M", 0);
      });

      expect(result.current.cartItems).toEqual({
        aaaaa: { M: 0 },
      });
      expect(result.current.getCartCount()).toBe(0);
    });
  });

  describe("search và showSearch", () => {
    it("nên quản lý state search đúng cách", () => {
      const { result } = renderShopContextHook();

      expect(result.current.search).toBe("");

      act(() => {
        result.current.setSearch("áo thun");
      });

      expect(result.current.search).toBe("áo thun");
    });

    it("nên quản lý state showSearch đúng cách", () => {
      const { result } = renderShopContextHook();

      expect(result.current.showSearch).toBe(false);

      act(() => {
        result.current.setShowSearch(true);
      });

      expect(result.current.showSearch).toBe(true);
    });
  });

  describe("constants", () => {
    it("nên có currency và deliveryFee đúng giá trị", () => {
      const { result } = renderShopContextHook();

      expect(result.current.currency).toBe("₫");
      expect(result.current.deliveryFee).toBe(10000);
    });
  });
});
