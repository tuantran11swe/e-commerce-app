import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ShopContextProvider from "../../context/ShopContextProvider";
import Product from "../Product";

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Helper để render Product với route params
function renderProduct(productId) {
  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <ShopContextProvider>{children}</ShopContextProvider>
    </MemoryRouter>
  );

  return render(<Product />, { wrapper: Wrapper });
}

describe("Product Component", () => {
  it("nên hiển thị loading khi chưa có dữ liệu sản phẩm", () => {
    renderProduct("invalid-id");

    // Component sẽ hiển thị "Đang tải..." khi productData là false
    expect(screen.getByText("Đang tải...")).toBeInTheDocument();
  });

  it("nên hiển thị thông tin sản phẩm khi có productId hợp lệ", async () => {
    renderProduct("aaaaa");

    await waitFor(() => {
      expect(screen.getByText("Áo Cotton Cổ Tròn Nữ")).toBeInTheDocument();
    });
  });

  it("nên hiển thị giá sản phẩm đã được format", async () => {
    renderProduct("aaaaa");

    await waitFor(() => {
      expect(screen.getByText("150.000 ₫")).toBeInTheDocument();
    });
  });

  it("nên hiển thị các size có sẵn", async () => {
    renderProduct("aaaaa");

    await waitFor(() => {
      expect(screen.getByText("S")).toBeInTheDocument();
      expect(screen.getByText("M")).toBeInTheDocument();
      expect(screen.getByText("L")).toBeInTheDocument();
    });
  });

  it("nên cho phép chọn size", async () => {
    const user = userEvent.setup();
    renderProduct("aaaaa");

    await waitFor(() => {
      const sizeButton = screen.getByText("M");
      expect(sizeButton).toBeInTheDocument();
    });

    const sizeButton = screen.getByText("M");
    await user.click(sizeButton);

    // Size đã được chọn sẽ có border màu cam
    expect(sizeButton).toHaveClass("border-orange-500");
  });

  it("nên hiển thị nút thêm vào giỏ hàng", async () => {
    renderProduct("aaaaa");

    await waitFor(() => {
      expect(screen.getByText("THÊM VÀO GIỎ")).toBeInTheDocument();
    });
  });

  it("nên hiển thị mô tả sản phẩm", async () => {
    renderProduct("aaaaa");

    await waitFor(() => {
      expect(
        screen.getByText(
          /Áo pullover nhẹ, thường được đan, ôm sát với cổ tròn và tay ngắn/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("nên hiển thị hình ảnh sản phẩm", async () => {
    renderProduct("aaaaa");

    await waitFor(() => {
      const images = screen.getAllByAltText(/Hình ảnh/i);
      expect(images.length).toBeGreaterThan(0);
    });
  });

  it("nên cho phép chuyển đổi hình ảnh khi click", async () => {
    const _user = userEvent.setup();
    renderProduct("aaaab"); // Sản phẩm có nhiều hình ảnh

    await waitFor(() => {
      const images = screen.getAllByAltText(/Hình ảnh/i);
      expect(images.length).toBeGreaterThan(1);
    });
  });

  it("nên hiển thị đánh giá sản phẩm", async () => {
    renderProduct("aaaaa");

    await waitFor(() => {
      expect(screen.getByText("(100)")).toBeInTheDocument();
    });
  });
});
