// src/contexts/AuthProvider.tsx
import React, { useState, useEffect, ReactNode } from "react"
import { AuthContext } from "./AuthContext"
import { login as apiLogin, logout as apiLogout, getCurrentUser } from "@/services/authService";
import { User } from "@/types/User";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ⬅️ ici

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = getCurrentUser();
    if (token && currentUser) {
      setIsAuthenticated(true);
      setUser(currentUser);
    }
    setLoading(false); // ⬅️ important
  }, []);

  const login = async (email: string, password: string) => {
    const authResponse = await apiLogin({ email, password });
    setIsAuthenticated(true);
    console.log("AuthProvider.login->",authResponse.user);
    setUser(authResponse.user);
  };

  const logout = () => {
    apiLogout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};