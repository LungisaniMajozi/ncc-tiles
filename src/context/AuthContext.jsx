import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ncc_admin");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // 🔐 Demo credentials - replace with real API later
    if (username === "admin" && password === "ncc2024") {
      const userData = { username, role: "admin", name: "NCC Admin" };
      localStorage.setItem("ncc_admin", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: "Invalid admin credentials" };
  };

  const logout = () => {
    localStorage.removeItem("ncc_admin");
    setUser(null);
  };

  const isAdmin = () => user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
