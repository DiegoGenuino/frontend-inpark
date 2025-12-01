import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // API endpoints - apenas rotas de API vão para o backend (sem subrotas de frontend)
      '^/(auth|estacionamento|reserva|reservas|valor|carro|carros|usuario|pagamentos|avaliacao|cliente|dono)': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Rota /dono apenas com ID numérico (API) - ex: /dono/123
      '^/dono/\\d+': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Rota /cliente apenas com ID numérico (API) - ex: /cliente/123
      '^/cliente/\\d+': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Rota /acesso sempre vai para backend (não conflita com frontend)
      '^/acesso': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

