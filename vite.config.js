import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Rotas do backend com ID numérico ou específicas (API)
      // Essas devem vir ANTES das rotas genéricas para terem prioridade
      
      // Rota /dono apenas com ID numérico (API) - ex: /dono/123
      '^/dono/\\d+$': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Rota /cliente apenas com ID numérico (API) - ex: /cliente/123
      '^/cliente/\\d+$': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Rota /acesso sempre vai para backend (não conflita com frontend)
      '^/acesso(/.*)?$': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // API endpoints - apenas rotas de API sem subrotas específicas do frontend
      '^/(auth|estacionamento|reserva|valor|carro|usuario|pagamentos|avaliacao|cliente|dono)(/.*)?$': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Rota GET /cliente e /dono para listagem (apenas quando não tem subrotas)
      // Esta regex NÃO deve fazer match com /dono ou /cliente sozinhos via navegador
      '^/(cliente|dono)\\?': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

