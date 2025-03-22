import { createContext } from "react";
import { User } from "../types/User";

export interface AuthContextType {
  user: User | null;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);