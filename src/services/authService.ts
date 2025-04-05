// services/authService.ts
  import { User } from "../types/User";

  export interface LoginCredentials {
        email: string;
        password: string;
  }

  export interface AuthResponse {
        token: string;
        user: {
            id: number;
            id_enterprise: number;
            name: string;
            email: string;
        };
  }
  
  const API_URL = "/api"; // à adapter
  
  export async function login(credentials: LoginCredentials): Promise<AuthResponse> {

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  
    if (!response.ok) {
      throw new Error("Échec de la connexion");
    }
  
    const data: AuthResponse = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data.user));

    console.log("User data stored in localStorage:", data.user);
    
    return data;
  }
  
  export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  }
  
  export const getCurrentUser = (): User | null => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  };
  
  export function getToken() {
    return localStorage.getItem("token");
  }