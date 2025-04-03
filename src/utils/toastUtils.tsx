// src/utils/toastUtils.ts
import { toast } from 'sonner'

export const toastSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
  });
};

export const toastError = (message: string, description?: string) => {
  toast.error(message, {
    description,
  });
};