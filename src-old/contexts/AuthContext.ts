import { createContext } from "react";
import { User } from "@/types/User"; // Assurez-vous que le chemin est correct

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User; // ou un type précis, ex: User | null
  setUser: (user: User) => void;
  login: () => void;
  logout: () => void;
}

// Exportation du contexte
export const AuthContext = createContext<AuthContextType | undefined>(undefined);