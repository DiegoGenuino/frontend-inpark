import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/auth.jsx'
import { Sidebar } from './components/sidebar/Sidebar.jsx'
import { SidebarDono } from './components/sidebar/SidebarDono.jsx'
import { Login } from './pages/auth/Login.jsx';
import { Signup } from './pages/auth/Signup.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Estacionamentos from './pages/estacionamentos/Estacionamentos.jsx'
import MinhasReservas from './pages/reservas/MinhasReservas.jsx'
import DetalhesEstacionamento from './pages/estacionamentos/DetalhesEstacionamento.jsx'
import CriacaoReserva from './pages/reservas/CriacaoReserva.jsx'
import Pagamento from './pages/pagamentos/Pagamento.jsx'
import ConfirmacaoPagamento from './pages/pagamentos/ConfirmacaoPagamento.jsx'
import Avaliacao from './pages/avaliacoes/Avaliacao.jsx'
import MinhasAvaliacoes from './pages/avaliacoes/MinhasAvaliacoes.jsx'
import MeuPerfil from './pages/perfil/MeuPerfil.jsx'
import MeusCarros from './pages/perfil/MeusCarros.jsx'
// Importações das páginas do dono
import DashboardDono from './pages/dono/DashboardDono.jsx'
import EstacionamentosDono from './pages/dono/EstacionamentosDono.jsx'
import ReservasDono from './pages/dono/ReservasDono.jsx'
import VagasDono from './pages/dono/VagasDono.jsx'
import FinanceiroDono from './pages/dono/FinanceiroDono.jsx'
import RelatoriosDono from './pages/dono/RelatoriosDono.jsx'
import PerfilDono from './pages/dono/PerfilDono.jsx'
import ConfiguracoesDono from './pages/dono/ConfiguracoesDono.jsx'
import AcessosDono from './pages/dono/AcessosDono.jsx'
import './App.css'

function AppContent() {
  const { isAuthenticated, loading, role } = useAuth();

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

  // Se não estiver autenticado, mostra apenas o login ou signup
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Se for DONO, mostra interface do proprietário
  if (role === 'DONO') {
    return (
      <div className="app-container">
        <SidebarDono />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardDono />} />
            <Route path="/dono" element={<DashboardDono />} />
            <Route path="/dono/estacionamentos" element={<EstacionamentosDono />} />
            <Route path="/dono/reservas" element={<ReservasDono />} />
            <Route path="/dono/vagas" element={<VagasDono />} />
            <Route path="/dono/acessos" element={<AcessosDono />} />
            <Route path="/dono/financeiro" element={<FinanceiroDono />} />
            <Route path="/dono/relatorios" element={<RelatoriosDono />} />
            <Route path="/dono/perfil" element={<PerfilDono />} />
            <Route path="/dono/configuracoes" element={<ConfiguracoesDono />} />
          </Routes>
        </main>
      </div>
    );
  }

  // Se for usuário comum, mostra o app completo com sidebar de cliente
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
          <Route path="/minhas-avaliacoes" element={<MinhasAvaliacoes />} />
          <Route path="/minhas-reservas" element={<MinhasReservas />} />
          <Route path="/meus-carros" element={<MeusCarros />} />
          <Route path="/meu-perfil" element={<MeuPerfil />} />
          {false && <Route path="/notificacoes" element={<div />} />}
          {false && <Route path="/relatorio-despesas" element={<div />} />}
          <Route path="/reservas" element={<div>Reservas</div>} />
          <Route path="/vagas" element={<div>Vagas</div>} />
          <Route path="/historico" element={<div>Histórico</div>} />
          {/* Guard para impedir acesso a rotas /dono/* por usuários não-DONO */}
          <Route path="/dono/*" element={<Navigate to="/" replace />} />
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
