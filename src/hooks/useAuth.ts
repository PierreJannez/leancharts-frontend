import { useContext } from "react";
import { AuthContext, AuthContextType } from "../contexts/AuthContext";

  // ✅ Hook personnalisé pour utiliser le contexte
  export const useAuth = (): AuthContextType => { 
  const context = useContext(AuthContext);
  console.log("1 - useAuth called", context);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  console.log("2 - useAuth context:", context);

  return context;
};
