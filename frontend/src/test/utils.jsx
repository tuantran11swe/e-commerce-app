import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ShopContextProvider from "../context/ShopContextProvider";

// Helper function để render component với tất cả providers cần thiết
// Giúp tránh lặp lại code setup trong mỗi test
export function renderWithProviders(ui, options = {}) {
  const Wrapper = ({ children }) => {
    return (
      <BrowserRouter>
        <ShopContextProvider>
          {children}
          <ToastContainer />
        </ShopContextProvider>
      </BrowserRouter>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
}
