import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook để debounce một giá trị
 * Hữu ích cho search input để giảm số lần gọi API
 * @param {any} value - Giá trị cần debounce
 * @param {number} delay - Thời gian delay (ms)
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timeout để update debounced value sau delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function - clear timeout nếu value thay đổi trước khi delay hết
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook để quản lý localStorage
 * @param {string} key - Key trong localStorage
 * @param {any} initialValue - Giá trị khởi tạo
 * @returns {[any, Function]} [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // State để lưu giá trị
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Lấy giá trị từ localStorage
      const item = window.localStorage.getItem(key);
      // Parse và return giá trị đã lưu hoặc initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Function để set giá trị
  const setValue = useCallback(
    (value) => {
      try {
        // Cho phép value là function như useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Lưu vào state
        setStoredValue(valueToStore);

        // Lưu vào localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
};
