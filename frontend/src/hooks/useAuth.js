import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as authApi from "../api/authApi";

/**
 * Custom hook để quản lý authentication
 * Cung cấp các function và state liên quan đến đăng nhập/đăng ký/đăng xuất
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra token và fetch user profile khi component mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          setLoading(true);
          const { user: userData } = await authApi.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // Token không hợp lệ, xóa đi
          setToken("");
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, [token]);

  // Lưu token vào localStorage khi thay đổi
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  /**
   * Đăng nhập
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const response = await authApi.login(email, password);

      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success("Đăng nhập thành công!");
        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Đăng nhập thất bại";
      toast.error(errorMessage);
      return { error: errorMessage, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Đăng ký
   */
  const register = useCallback(async (name, email, password) => {
    try {
      setLoading(true);
      const response = await authApi.register(name, email, password);

      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success("Đăng ký thành công!");
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Đăng ký thất bại";
      toast.error(errorMessage);
      return { error: errorMessage, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Đăng xuất
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authApi.logout();

      // Clear state
      setToken("");
      setUser(null);
      setIsAuthenticated(false);

      toast.success("Đăng xuất thành công!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn clear state dù API lỗi
      setToken("");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Refresh user profile
   */
  const refreshProfile = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const { user: userData } = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    refreshProfile,
    register,
    setToken,
    token,
    user,
  };
};
