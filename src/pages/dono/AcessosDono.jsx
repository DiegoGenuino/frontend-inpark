import React, { useEffect, useState, useCallback } from 'react';
import { 
  MdDirectionsCar, 
  MdAccessTime, 
  MdAttachMoney,
  MdExitToApp,
  MdPlayArrow,
  MdRefresh,
  MdFilterList,
  MdCheckCircle,
  MdRadioButtonChecked
} from 'react-icons/md';
import { Header, Toast } from '../../components/shared';
import api from '../../utils/api';
import './AcessosDono.css';

const AcessosDono = () => {
  const [acessos, setAcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'ativos', 'encerrados'
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());

  const fetchAcessos = useCallback(async () => {
    try {
      const data = await api.get('/acesso');
      const lista = Array.isArray(data) ? data : (data.content || []);
      setAcessos(lista);
      setUltimaAtualizacao(new Date());
      setToast(null);
    } catch (e) {
      console.error('Erro ao carregar acessos:', e);
      setToast({ message: e.message || 'Erro ao carregar acessos', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcessos();
  }, [fetchAcessos]);

  // Auto-refresh a cada 10 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAcessos();
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [autoRefresh, fetchAcessos]);

  // Filtragem
  const acessosFiltrados = acessos.filter(acesso => {
    if (filtro === 'ativos') return !acesso.horaDeSaida;
    if (filtro === 'encerrados') return !!acesso.horaDeSaida;
    return true;
  });

  // Estatísticas
  const stats = {
    total: acessos.length,
    ativos: acessos.filter(a => !a.horaDeSaida).length,
    encerrados: acessos.filter(a => !!a.horaDeSaida).length,
    receitaTotal: acessos.reduce((sum, a) => sum + (a.valorAPagar || 0), 0)
  };

  const calcularTempoDecorrido = (horaEntrada) => {
    if (!horaEntrada) return '0h 0min';
    
    const [horas, minutos] = horaEntrada.split(':').map(Number);
    const entrada = new Date();
    entrada.setHours(horas, minutos, 0);
    
    const agora = new Date();
    const diffMs = agora - entrada;
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHoras}h ${diffMinutos}min`;
  };

  const formatarTempo = (tempo) => {
    if (!tempo) return '--:--';
    return tempo.substring(0, 5);
  };

  const getStatusColor = (acesso) => {
    if (acesso.horaDeSaida) return '#6b7280'; // Cinza para encerrados
    
    // Verde pulsante para ativos
    return '#c2fe00';
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Carregando acessos...</div>
      </div>
    );
  }

  return (
    <div className="acessos-dono-container">
      <Header 
        title="Acessos em Tempo Real"
        subtitle="Monitore entradas e saídas dos estacionamentos"
        actions={
          <div className="header-actions">
            {/* Toggle Auto-refresh */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`btn-auto-refresh ${autoRefresh ? 'active' : 'inactive'}`}
            >
              <MdRefresh size={18} className={autoRefresh ? 'spin-animation' : ''} />
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </button>

            {/* Botão refresh manual */}
            <button
              onClick={fetchAcessos}
              className="btn-refresh"
            >
              <MdRefresh size={18} />
              Atualizar
            </button>
          </div>
        }
      />
      
      <div className="acessos-content">
        {/* Última atualização */}
        <div className="last-update">
          Última atualização: {ultimaAtualizacao.toLocaleTimeString('pt-BR')}
        </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total de Acessos</div>
          <div className="kpi-value">{stats.total}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Veículos Ativos</div>
          <div className="kpi-value active">
            <MdRadioButtonChecked size={24} className="pulse-animation" />
            {stats.ativos}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Encerrados</div>
          <div className="kpi-value closed">{stats.encerrados}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Receita Total</div>
          <div className="kpi-value revenue">
            R$ {stats.receitaTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filter-bar">
        <MdFilterList size={20} style={{ color: '#6b7280' }} />
        <div className="filter-buttons">
          {['todos', 'ativos', 'encerrados'].map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`filter-btn ${filtro === f ? 'active' : 'inactive'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="filter-count">
          {acessosFiltrados.length} registro{acessosFiltrados.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Lista de Acessos */}
      {acessosFiltrados.length === 0 ? (
        <div className="empty-state">
          <MdDirectionsCar size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <h3>Nenhum acesso encontrado</h3>
          <p>
            {filtro === 'ativos' && 'Não há veículos ativos no momento'}
            {filtro === 'encerrados' && 'Nenhum acesso encerrado registrado'}
            {filtro === 'todos' && 'Nenhum acesso registrado'}
          </p>
        </div>
      ) : (
        <div className="access-list">
          {acessosFiltrados.map(acesso => {
            const isAtivo = !acesso.horaDeSaida;
            const statusColor = getStatusColor(acesso);

            return (
              <div 
                key={acesso.id}
                className={`access-item ${isAtivo ? 'active' : ''}`}
              >
                {/* Indicador de status */}
                {isAtivo && (
                  <div className="active-indicator" style={{ background: statusColor }} />
                )}

                {/* Placa */}
                <div className={`placa-badge ${isAtivo ? 'active' : 'inactive'}`}>
                  {acesso.placaDoCarro}
                </div>

                {/* Informações de horário */}
                <div className="info-group">
                  <div className="info-row">
                    <MdPlayArrow size={20} style={{ color: '#65a30d' }} />
                    <span className="info-label">Entrada:</span>
                    <span className="info-value">
                      {formatarTempo(acesso.horaDeEntrada)}
                    </span>
                  </div>
                  
                  {acesso.horaDeSaida ? (
                    <div className="info-row">
                      <MdExitToApp size={20} style={{ color: '#ef4444' }} />
                      <span className="info-label">Saída:</span>
                      <span className="info-value">
                        {formatarTempo(acesso.horaDeSaida)}
                      </span>
                    </div>
                  ) : (
                    <div className="info-row">
                      <MdAccessTime size={20} style={{ color: '#3b82f6' }} />
                      <span className="info-label">Tempo:</span>
                      <span className="info-value time">
                        {calcularTempoDecorrido(acesso.horaDeEntrada)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tempo Total */}
                <div className="stat-group">
                  <div className="stat-label">
                    Total de Horas
                  </div>
                  <div className="stat-value-row">
                    <MdAccessTime size={24} style={{ color: '#6b7280' }} />
                    {acesso.totalHoras ? `${acesso.totalHoras}h` : '—'}
                  </div>
                </div>

                {/* Valor */}
                <div className="stat-group">
                  <div className="stat-label">
                    Valor a Pagar
                  </div>
                  <div className="stat-value-row revenue">
                    <MdAttachMoney size={24} />
                    {acesso.valorAPagar ? `R$ ${acesso.valorAPagar.toFixed(2)}` : '—'}
                  </div>
                </div>

                {/* Badge de Status */}
                <div className={`status-badge ${isAtivo ? 'active' : 'inactive'}`}>
                  {isAtivo ? (
                    <>
                      <MdRadioButtonChecked size={16} />
                      Ativo
                    </>
                  ) : (
                    <>
                      <MdCheckCircle size={16} />
                      Encerrado
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      </div>
    </div>
  );
};

export default AcessosDono;
