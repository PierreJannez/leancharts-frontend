// utils/errorUtils.ts
import { AxiosError } from "axios"
import { toastError } from "@/utils/toastUtils"

export const handleBackendError = (err: unknown) => {
  // Si c’est une erreur Axios
  if ((err as AxiosError)?.isAxiosError) {
    const axiosErr = err as AxiosError<{ error?: string }>

    // 1. Message d’erreur spécifique renvoyé par le backend
    const backendMessage = axiosErr.response?.data?.error
    if (backendMessage) {
      toastError(backendMessage)
      return
    }

    // 2. Sinon, afficher un message réseau ou HTTP si disponible
    if (axiosErr.message) {
      toastError(`Erreur serveur : ${axiosErr.message}`)
      return
    }
  }

  // 3. Autres erreurs génériques (non Axios)
  console.error("Erreur inconnue :", err)
  toastError("Une erreur inconnue est survenue.")
}