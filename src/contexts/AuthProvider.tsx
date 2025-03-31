// src/contexts/AuthProvider.tsx
import React, { useState, useEffect, ReactNode } from "react"
import { AuthContext } from "./AuthContext"
import { login as apiLogin, logout as apiLogout, getCurrentUser } from "@/services/authService";
import { User } from "@/types/User";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // 🔁 Init au chargement : token + user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = getCurrentUser();
    if (token && currentUser) {
      setIsAuthenticated(true);
      setUser(currentUser);
    }
  }, []);

  // ✅ Login avec appel réel à l'API
  const login = async (email: string, password: string) => {
    const authResponse = await apiLogin({ email, password });
    setIsAuthenticated(true);
    setUser(authResponse.user);
  };

  // ✅ Logout
  const logout = () => {
    apiLogout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};