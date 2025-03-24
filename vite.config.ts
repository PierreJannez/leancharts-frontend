import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    port: 5173, // Port dev par défaut (utile mais optionnel)
  },
  preview: {
    port: 8080, // Pour Render (prod)
  },
  build: {
    chunkSizeWarningLimit: 1000 // Optionnel : supprime warning de taille
  }
})