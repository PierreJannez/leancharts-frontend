import axios from "axios"

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}

export const registerUser = async (payload: RegisterPayload): Promise<void> => {
  try {
    console.log("userService.registerUser => ", payload);
    const res = await axios.post("/api/clients/register", payload);
    console.log("userService.registerUser => ",res.data)
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error)
    throw error
  }
}