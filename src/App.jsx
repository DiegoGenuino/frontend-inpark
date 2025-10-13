import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/auth.jsx'
import { Sidebar } from './components/sidebar/Sidebar.jsx'
import { Login } from './pages/auth/Login.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Estacionamentos from './pages/estacionamentos/Estacionamentos.jsx'
import MinhasReservas from './pages/reservas/MinhasReservas.jsx'
import DetalhesEstacionamento from './pages/estacionamentos/DetalhesEstacionamento.jsx'
import CriacaoReserva from './pages/reservas/CriacaoReserva.jsx'
import Pagamento from './pages/pagamentos/Pagamento.jsx'
import ConfirmacaoPagamento from './pages/pagamentos/ConfirmacaoPagamento.jsx'
import Avaliacao from './pages/avaliacoes/Avaliacao.jsx'
import MeuPerfil from './pages/perfil/MeuPerfil.jsx'
import MeusCarros from './pages/perfil/MeusCarros.jsx'
import Notificacoes from './pages/perfil/Notificacoes.jsx'
import './App.css'

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Carregando...
      </div>
    );
  }

  // Se não estiver autenticado, mostra apenas o login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Se estiver autenticado, mostra o app completo com sidebar e dashboard
  return (
    <div className="app-container">
      <Sidebar/>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/estacionamentos" element={<Estacionamentos />} />
          <Route path="/estacionamento/:id" element={<DetalhesEstacionamento />} />
          <Route path="/estacionamento/:id/reservar" element={<CriacaoReserva />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/pagamento/confirmacao" element={<ConfirmacaoPagamento />} />
          <Route path="/avaliacao/:reservaId" element={<Avaliacao />} />
          <Route path="/minhas-reservas" element={<MinhasReservas />} />
          <Route path="/meus-carros" element={<MeusCarros />} />
          <Route path="/meu-perfil" element={<MeuPerfil />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/relatorio-despesas" element={<div>Relatório de Despesas - Em desenvolvimento</div>} />
          <Route path="/reservas" element={<div>Reservas</div>} />
          <Route path="/vagas" element={<div>Vagas</div>} />
          <Route path="/historico" element={<div>Histórico</div>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
