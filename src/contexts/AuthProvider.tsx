import React, { useState } from "react";
import { getCurrentUser, logout as logoutService } from "../services/authService.ts";
import { User } from "../types/User";
import { AuthContext } from "./AuthContext"; // Importez le contexte depuis le nouveau fichier

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getCurrentUser());

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
