import axios from "axios"
import { User } from "@/types/User"

export interface RegisterPayload {
  id_enterprise: number
  enterprise: string
  id_service: number
  firstName: string
  lastName: string
  email: string
  password: string
}

// 🔁 Conversion RegisterPayload → User-like
export const toUser = (payload: RegisterPayload): Omit<User, "id"> => ({
  id_enterprise: payload.id_enterprise,
  enterprise: payload.enterprise,
  id_service: payload.id_service,
  firstName: payload.firstName,
  lastName: payload.lastName,
  email: payload.email
})

// ▶️ Inscription (création d’un utilisateur via page d’enregistrement)
export const registerUser = async (payload: RegisterPayload): Promise<void> => {
  try {
    const res = await axios.post("/api/clients/register", payload)
    return res.data
  } catch (error) {
      console.error("Erreur lors de l'inscription :", error)
    throw error
  }
}

const API_BASE = "/api/users"

// ▶️ CRUD via Admin Panel
export const fetchUsers = async (id_enterprise: number): Promise<User[]> => {
  const res = await axios.get(API_BASE, {
    params: { id_enterprise },
  })
  return res.data
}

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const res = await axios.post(API_BASE, user)
  return res.data
}

export const updateUser = async (user: User): Promise<User> => {
  const res = await axios.put(`${API_BASE}/${user.id}`, user)
  return res.data
}

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`)
}