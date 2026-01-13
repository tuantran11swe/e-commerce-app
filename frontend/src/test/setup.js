import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Dọn dẹp sau mỗi test để tránh rò rỉ state giữa các test
afterEach(() => {
  cleanup();
});
