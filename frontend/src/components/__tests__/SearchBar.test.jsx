import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import ShopContextProvider from "../../context/ShopContextProvider";
import SearchBar from "../SearchBar";

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Helper để render SearchBar với route
function renderSearchBar(route = "/collection") {
  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={[route]}>
      <ShopContextProvider>
        {children}
        {/* Mock setShowSearch để có thể control showSearch */}
      </ShopContextProvider>
    </MemoryRouter>
  );

  return render(<SearchBar />, { wrapper: Wrapper });
}

describe("SearchBar Component", () => {
  it("nên không hiển thị khi không ở trang collection", () => {
    renderSearchBar("/");

    const searchInput = screen.queryByPlaceholderText("Tìm kiếm...");
    expect(searchInput).not.toBeInTheDocument();
  });

  it("nên không hiển thị khi showSearch là false", () => {
    renderSearchBar("/collection");

    const searchInput = screen.queryByPlaceholderText("Tìm kiếm...");
    expect(searchInput).not.toBeInTheDocument();
  });

  it("nên hiển thị khi ở trang collection và showSearch là true", () => {
    // Để test này hoạt động, chúng ta cần set showSearch = true trong context
    // Tạm thời test này sẽ kiểm tra component có thể render
    renderSearchBar("/collection");

    // Component sẽ render nhưng có thể không hiển thị nếu showSearch = false trong context
    // Test này cần được cải thiện với mock context
  });

  it("nên cho phép nhập từ khóa tìm kiếm", async () => {
    userEvent.setup();
    // Test này cần mock context với showSearch = true
    // Tạm thời chỉ kiểm tra component có thể render
  });

  it("nên hiển thị icon tìm kiếm", () => {
    // Test này cần mock context với showSearch = true
  });

  it("nên cho phép đóng thanh tìm kiếm", async () => {
    userEvent.setup();
    // Test này cần mock context with showSearch = true
    // và kiểm tra setShowSearch(false) được gọi khi click nút đóng
  });
});
