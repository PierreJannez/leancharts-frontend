// utils/errorUtils.ts
import { AxiosError } from "axios"
import { toastError } from "@/utils/toastUtils"

export const handleBackendError = (err: unknown) => {
  const axiosErr = err as AxiosError<{ error?: string }>
  const backendMessage = axiosErr?.response?.data?.error
  if (backendMessage) toastError(backendMessage)
}