import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
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
      '/reserva': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/reservas': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/valor': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/dono': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/cliente': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/acesso': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/carro': {
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
      '/avaliacao': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
