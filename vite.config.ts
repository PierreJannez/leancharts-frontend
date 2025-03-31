import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3500',
        changeOrigin: true,
      },
    },
    port: 5173, // Port dev par défaut (utile mais optionnel)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
/*  preview: {
    port: parseInt(process.env.PORT || '8080'), // Pour Render (prod)
    host: '0.0.0.0', // 🔥 Indispensable pour Render
    allowedHosts: ['leancharts-frontend.onrender.com']
  },
*/
  build: {
    chunkSizeWarningLimit: 1000 // Optionnel : supprime warning de taille
  }
})