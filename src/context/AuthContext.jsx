import { createContext, useContext, useState, useEffect } from "react";
import API_BASE_URL from "../config/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = API_BASE_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem("ncc_user");
    const storedToken = localStorage.getItem("ncc_token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("ncc_user", JSON.stringify(data.user));
        localStorage.setItem("ncc_token", data.access_token);
        setUser(data.user);
        setToken(data.access_token);
        return { success: true, role: data.user.role };
      } else {
        return { success: false, error: data.detail || "Login failed" };
      }
    } catch (err) {
      return { success: false, error: "Network error. Server might be down." };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "customer" }),
      });
      const data = await response.json();

      if (response.ok) {
        return await login(email, password);
      } else {
        return { success: false, error: data.detail || "Registration failed" };
      }
    } catch (err) {
      return { success: false, error: "Network error. Server might be down." };
    }
  };

  const logout = () => {
    localStorage.removeItem("ncc_user");
    localStorage.removeItem("ncc_token");
    setUser(null);
    setToken(null);
  };

  const updateUser = async (updates) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("ncc_user", JSON.stringify(data));
        setUser(data);
        return { success: true };
      } else {
        return { success: false, error: data.detail || "Update failed" };
      }
    } catch (err) {
      return { success: false, error: "Network error." };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        return {
          success: true,
          message: data.message,
          dev_token: data.dev_token,
        };
      } else {
        return { success: false, error: data.detail || "Request failed" };
      }
    } catch (err) {
      return { success: false, error: "Network error." };
    }
  };

  const resetPassword = async (reset_token, new_password) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset_token, new_password }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.detail || "Reset failed" };
      }
    } catch (err) {
      return { success: false, error: "Network error." };
    }
  };

  const isAdmin = () => user?.role === "admin";
  const isAuth = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        register,
        login,
        logout,
        isAdmin,
        isAuth,
        loading,
        updateUser,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
