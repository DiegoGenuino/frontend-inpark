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
    // Simular carregamento de dados
    setTimeout(() => {
      setStats({
        estacionamentos: 3,
        vagasDisponiveis: 45,
        reservasHoje: 12,
        receitaMensal: 15420.50,
        reservasPendentes: 8,
        reservasAceitas: 156,
        reservasCanceladas: 12,
        taxaOcupacao: 78.5
      });

      setReservasRecentes([
        {
          id: 1,
          cliente: 'João Silva',
          estacionamento: 'Estacionamento Centro',
          vaga: 'A-15',
          dataHora: '2024-11-10 14:30',
          valor: 25.00,
          status: 'PENDENTE'
        },
        {
          id: 2,
          cliente: 'Maria Santos',
          estacionamento: 'Estacionamento Shopping',
          vaga: 'B-08',
          dataHora: '2024-11-10 15:00',
          valor: 30.00,
          status: 'ACEITA'
        },
        {
          id: 3,
          cliente: 'Pedro Oliveira',
          estacionamento: 'Estacionamento Centro',
          vaga: 'C-22',
          dataHora: '2024-11-10 16:30',
          valor: 20.00,
          status: 'PENDENTE'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusClass = (status) => {
    const statusMap = {
      PENDENTE: 'status-pendente',
      ACEITA: 'status-aceita',
      CANCELADA: 'status-cancelada'
    };
    return statusMap[status] || '';
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      PENDENTE: 'Pendente',
      ACEITA: 'Aceita',
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
      <div className="page-header">
        <div className="header-text">
          <h1>Dashboard do Proprietário</h1>
          <p>Visão geral do seu negócio de estacionamentos</p>
        </div>
      </div>

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
        <div className="table-container">
          <table className="reservas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Estacionamento</th>
                <th>Vaga</th>
                <th>Data/Hora</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservasRecentes.map((reserva) => (
                <tr key={reserva.id}>
                  <td>#{reserva.id.toString().padStart(4, '0')}</td>
                  <td>{reserva.cliente}</td>
                  <td>{reserva.estacionamento}</td>
                  <td><span className="vaga-badge">{reserva.vaga}</span></td>
                  <td>{reserva.dataHora}</td>
                  <td>R$ {reserva.valor.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(reserva.status)}`}>
                      {getStatusLabel(reserva.status)}
                    </span>
                  </td>
                  <td>
                    {reserva.status === 'PENDENTE' && (
                      <div className="action-buttons">
                        <button className="btn-accept">Aceitar</button>
                        <button className="btn-reject">Recusar</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardDono;
