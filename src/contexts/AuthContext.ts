import { createContext } from "react";
import { User } from "../types/User";

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

// Exportation du contexte
export const AuthContext = createContext<AuthContextType | undefined>(undefined);