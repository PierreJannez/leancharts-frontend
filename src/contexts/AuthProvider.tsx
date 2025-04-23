// src/contexts/AuthProvider.tsx
import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { login as apiLogin, logout as apiLogout, getCurrentUser } from "@/services/authService";
import { User } from "@/types/User";

// 🔐 Helpers pour session isolée par iframe
function getSessionKey(): string {
  if (!window.name) {
    window.name = crypto.randomUUID();
  }
  return window.name;
}

function storeToken(token: string) {
  const sessionKey = getSessionKey();
  sessionStorage.setItem(`token-${sessionKey}`, token);
}

function getToken(): string | null {
  const sessionKey = getSessionKey();
  return sessionStorage.getItem(`token-${sessionKey}`);
}

function clearToken() {
  const sessionKey = getSessionKey();
  sessionStorage.removeItem(`token-${sessionKey}`);
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const currentUser = getCurrentUser();
    if (token && currentUser) {
      setIsAuthenticated(true);
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const authResponse = await apiLogin({ email, password });
    storeToken(authResponse.token);
    setIsAuthenticated(true);
    console.log("AuthProvider.login->", authResponse.user);
    setUser(authResponse.user);
  };

  const logout = () => {
    apiLogout();
    clearToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};