import React, { useState } from "react";
import { getCurrentUser, logout as logoutService } from "../services/authService";
import { User } from "../types/User";
import { AuthContext } from "./AuhContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getCurrentUser());

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};