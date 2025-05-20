// services/authService.ts
  import { User } from "../types/User";

  export interface LoginCredentials {
        email: string;
        password: string;
  }

  export interface AuthResponse {
        token: string;
        user: User;
  }
  
  const API_URL = "/api"; // à adapter
  
  export async function login(credentials: LoginCredentials): Promise<AuthResponse> {

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  
    if (!response.ok) {
      let errorMessage = "Échec de la connexion";
      try {
        const errorBody = await response.json();
        if (errorBody?.message) {
          errorMessage = errorBody.message;
        }
      } catch {
        // ignore JSON parse error
      }
      throw new Error(errorMessage);
    }  
    
    const data: AuthResponse = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data.user));

    console.log("User data stored in localStorage:", localStorage.getItem("currentUser"));
    
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
  
  function getSessionKey(): string {
    if (!window.name) {
      window.name = crypto.randomUUID();
    }
    return window.name;
  }
  
  export function storeToken(token: string) {
    const sessionKey = getSessionKey();
    localStorage.setItem(`token-${sessionKey}`, token);
  }
  
  export function getToken(): string | null {
    const sessionKey = getSessionKey();
    return localStorage.getItem(`token-${sessionKey}`);
  }
  
  export function clearToken() {
    const sessionKey = getSessionKey();
    localStorage.removeItem(`token-${sessionKey}`);
  }