import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => { 
  const context = useContext(AuthContext);
  console.log("1 - useAuth called", context);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  console.log("2 - useAuth context:", context);

  return context;
};