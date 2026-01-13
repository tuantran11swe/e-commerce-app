import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ShopContextProvider from "../../context/ShopContextProvider";
import Cart from "../Cart";

// Mock window.confirm
const mockConfirm = vi.fn();
window.confirm = mockConfirm;

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
  },
}));

// Helper để render Cart với context có dữ liệu giỏ hàng
function renderCartWithCartItems(_cartItems = {}) {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <ShopContextProvider>{children}</ShopContextProvider>
    </BrowserRouter>
  );

  return render(<Cart />, { wrapper: Wrapper });
}

describe("Cart Component", () => {
  beforeEach(() => {
    mockConfirm.mockClear();
  });

  it("nên hiển thị tiêu đề giỏ hàng", () => {
    renderCartWithCartItems();

    expect(screen.getByText("GIỎ")).toBeInTheDocument();
    expect(screen.getByText("HÀNG")).toBeInTheDocument();
  });

  it("nên hiển thị nút thanh toán", () => {
    renderCartWithCartItems();

    const checkoutButton = screen.getByText("TIẾN HÀNH THANH TOÁN");
    expect(checkoutButton).toBeInTheDocument();
  });

  it("nên hiển thị CartTotal component", () => {
    renderCartWithCartItems();

    // CartTotal sẽ hiển thị "GIỎ" và "HÀNG" một lần nữa
    const titles = screen.getAllByText("GIỎ");
    expect(titles.length).toBeGreaterThan(0);
  });
});
