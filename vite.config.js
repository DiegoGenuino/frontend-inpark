import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/estacionamento': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/reservas': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/carros': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/usuario': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/pagamentos': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/avaliacoes': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
