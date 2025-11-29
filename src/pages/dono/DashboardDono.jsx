import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdLocalParking,
  MdAttachMoney,
  MdEventNote,
  MdTrendingUp,
  MdCheckCircle,
  MdPending,
  MdCancel,
  MdPeople
} from 'react-icons/md';
import api from '../../utils/api';
import { donoService } from '../../utils/services';
import { Header, ReservasTable } from '../../components/shared';
import './DashboardDono.css';

const DashboardDono = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    estacionamentos: 0,
    vagasDisponiveis: 0,
    reservasHoje: 0,
    receitaMensal: 0,
    reservasPendentes: 0,
    reservasAceitas: 0,
    reservasCanceladas: 0,
    taxaOcupacao: 0
  });

  const [reservasRecentes, setReservasRecentes] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Buscar estacionamentos do dono
        const estacionamentos = await donoService.getMeusEstacionamentos();
        const lista = Array.isArray(estacionamentos) ? estacionamentos : (estacionamentos.content || []);
        
        // 2. Filtrar apenas estacionamentos ativos
        const estacionamentosAtivos = lista.filter(e => e.status === true);
        
        // 3. Calcular total de vagas (soma do maximoDeVagas de todos os estacionamentos ativos)
        const totalVagas = estacionamentosAtivos.reduce((sum, e) => sum + (e.maximoDeVagas || 0), 0);
        
        // 4. Contar vagas disponíveis (totalVagas - acessos ativos)
        const acessosAtivos = estacionamentosAtivos.reduce((sum, e) => {
          const acessosAbertos = (e.acessos || []).filter(a => !a.horaDeSaida);
          return sum + acessosAbertos.length;
        }, 0);
        const vagasDisponiveis = totalVagas - acessosAtivos;
        
        // 5. Contar reservas por status
        let todasReservas = [];
        estacionamentosAtivos.forEach(e => {
          if (e.reservas && Array.isArray(e.reservas)) {
            todasReservas = [...todasReservas, ...e.reservas];
          }
        });
        
        const reservasPendentes = todasReservas.filter(r => r.statusReserva === 'PENDENTE').length;
        const reservasAceitas = todasReservas.filter(r => r.statusReserva === 'ACEITA').length;
        const reservasCanceladas = todasReservas.filter(r => r.statusReserva === 'RECUSADA' || r.statusReserva === 'CANCELADA').length;
        
        // 6. Calcular taxa de ocupação
        const taxaOcupacao = totalVagas > 0 ? ((acessosAtivos / totalVagas) * 100).toFixed(1) : 0;
        
        // 7. Atualizar stats
        setStats({
          estacionamentos: estacionamentosAtivos.length,
          vagasDisponiveis: vagasDisponiveis,
          reservasHoje: todasReservas.length,
          receitaMensal: 0, // TODO: calcular da API de valores
          reservasPendentes: reservasPendentes,
          reservasAceitas: reservasAceitas,
          reservasCanceladas: reservasCanceladas,
          taxaOcupacao: parseFloat(taxaOcupacao)
        });
        
        // 8. Pegar últimas 3 reservas
        const reservasOrdenadas = todasReservas
          .sort((a, b) => new Date(b.dataDaReserva) - new Date(a.dataDaReserva))
          .slice(0, 3);
        
        setReservasRecentes(reservasOrdenadas);
        
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusClass = (status) => {
    const statusMap = {
      PENDENTE: 'status-pendente',
      ACEITA: 'status-aceita',
      RECUSADA: 'status-cancelada',
      CANCELADA: 'status-cancelada'
    };
    return statusMap[status] || '';
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      PENDENTE: 'Pendente',
      ACEITA: 'Aceita',
      RECUSADA: 'Recusada',
      CANCELADA: 'Cancelada'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="dashboard-dono-container">
        <div className="loading-container">
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-dono-container">
      <Header 
        title="Dashboard do Proprietário"
        subtitle="Visão geral do seu negócio de estacionamentos"
      />

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e3f2fd' }}>
            <MdLocalParking style={{ color: '#1976d2' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Estacionamentos</p>
            <h3 className="stat-value">{stats.estacionamentos}</h3>
            <span className="stat-sublabel">Ativos</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e5f5' }}>
            <MdEventNote style={{ color: '#7b1fa2' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Vagas Disponíveis</p>
            <h3 className="stat-value">{stats.vagasDisponiveis}</h3>
            <span className="stat-sublabel">No momento</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e8f5e9' }}>
            <MdAttachMoney style={{ color: '#388e3c' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Receita Mensal</p>
            <h3 className="stat-value">R$ {stats.receitaMensal.toFixed(2)}</h3>
            <span className="stat-sublabel stat-positive">
              <MdTrendingUp /> +12.5% vs mês anterior
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fff3e0' }}>
            <MdPending style={{ color: '#f57c00' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Reservas Pendentes</p>
            <h3 className="stat-value">{stats.reservasPendentes}</h3>
            <span className="stat-sublabel">Aguardando aprovação</span>
          </div>
        </div>
      </div>

      {/* Resumo de Reservas */}
      <div className="content-grid">
        <div className="info-section">
          <div className="section-header">
            <h2>Resumo de Reservas</h2>
          </div>
          <div className="reservas-summary">
            <div className="summary-item">
              <MdCheckCircle className="summary-icon aceita" />
              <div>
                <p className="summary-label">Aceitas</p>
                <p className="summary-value">{stats.reservasAceitas}</p>
              </div>
            </div>
            <div className="summary-item">
              <MdPending className="summary-icon pendente" />
              <div>
                <p className="summary-label">Pendentes</p>
                <p className="summary-value">{stats.reservasPendentes}</p>
              </div>
            </div>
            <div className="summary-item">
              <MdCancel className="summary-icon cancelada" />
              <div>
                <p className="summary-label">Canceladas</p>
                <p className="summary-value">{stats.reservasCanceladas}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="section-header">
            <h2>Taxa de Ocupação</h2>
          </div>
          <div className="ocupacao-info">
            <div className="ocupacao-chart">
              <div className="chart-circle">
                <span className="chart-value">{stats.taxaOcupacao}%</span>
              </div>
            </div>
            <p className="ocupacao-text">
              {stats.taxaOcupacao >= 80 
                ? 'Excelente! Alta taxa de ocupação' 
                : stats.taxaOcupacao >= 50 
                ? 'Boa taxa de ocupação' 
                : 'Há espaço para crescimento'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Reservas Recentes */}
      <div className="reservas-section">
        <div className="section-header">
          <h2>Reservas Recentes</h2>
          <button className="btn-view-all" onClick={() => navigate('/dono/reservas')}>
            Ver todas
          </button>
        </div>
        <ReservasTable 
          reservas={reservasRecentes}
          onAceitar={() => navigate('/dono/reservas')}
          onRecusar={() => navigate('/dono/reservas')}
          compact={true}
        />
      </div>
    </div>
  );
};

export default DashboardDono;
