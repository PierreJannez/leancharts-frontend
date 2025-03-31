// src/contexts/auth-context.ts
import { createContext, useContext } from "react"
import { User } from "@/types/User";

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null; // ou un type précis, ex: User | null
    setUser: (user: User) => void;
    login: (email: string, password: string) => Promise<void>; // ✅ corrigé ici
    logout: () => void;
  }

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}