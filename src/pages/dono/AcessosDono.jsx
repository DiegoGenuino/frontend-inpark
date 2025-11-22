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
import api from '../../utils/api';

const AcessosDono = () => {
  const [acessos, setAcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'ativos', 'encerrados'
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());

  const fetchAcessos = useCallback(async () => {
    try {
      const data = await api.get('/acesso');
      const lista = Array.isArray(data) ? data : (data.content || []);
      setAcessos(lista);
      setUltimaAtualizacao(new Date());
      setError('');
    } catch (e) {
      console.error('Erro ao carregar acessos:', e);
      setError(e.message || 'Erro ao carregar acessos');
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
    return '#10b981';
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Carregando acessos...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ margin: '0 0 .5rem 0', fontSize: '1.875rem', fontWeight: '700', color: '#111827' }}>
              Acessos em Tempo Real
            </h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '.875rem' }}>
              Monitore entradas e saídas dos estacionamentos
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
            {/* Toggle Auto-refresh */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              style={{
                padding: '.625rem 1rem',
                background: autoRefresh ? '#10b981' : '#e5e7eb',
                color: autoRefresh ? '#ffffff' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '.5rem',
                transition: 'all 0.2s'
              }}
            >
              <MdRefresh size={18} style={{ animation: autoRefresh ? 'spin 2s linear infinite' : 'none' }} />
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </button>

            {/* Botão refresh manual */}
            <button
              onClick={fetchAcessos}
              style={{
                padding: '.625rem 1rem',
                background: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '.5rem'
              }}
            >
              <MdRefresh size={18} />
              Atualizar
            </button>
          </div>
        </div>

        {/* Última atualização */}
        <div style={{ fontSize: '.75rem', color: '#9ca3af' }}>
          Última atualização: {ultimaAtualizacao.toLocaleTimeString('pt-BR')}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: '#ffffff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '.875rem', color: '#6b7280', marginBottom: '.5rem' }}>Total de Acessos</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{stats.total}</div>
        </div>

        <div style={{
          background: '#ffffff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: '.875rem', color: '#6b7280', marginBottom: '.5rem' }}>Veículos Ativos</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <MdRadioButtonChecked size={24} style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            {stats.ativos}
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '.875rem', color: '#6b7280', marginBottom: '.5rem' }}>Encerrados</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6b7280' }}>{stats.encerrados}</div>
        </div>

        <div style={{
          background: '#ffffff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '.875rem', color: '#6b7280', marginBottom: '.5rem' }}>Receita Total</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
            R$ {stats.receitaTotal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ 
        background: '#ffffff',
        padding: '1rem',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <MdFilterList size={20} style={{ color: '#6b7280' }} />
        <div style={{ display: 'flex', gap: '.5rem' }}>
          {['todos', 'ativos', 'encerrados'].map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                padding: '.5rem 1rem',
                background: filtro === f ? '#3b82f6' : '#f3f4f6',
                color: filtro === f ? '#ffffff' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                fontSize: '.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '.875rem', color: '#6b7280' }}>
          {acessosFiltrados.length} registro{acessosFiltrados.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Lista de Acessos */}
      {error && (
        <div style={{ 
          padding: '1rem', 
          background: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '8px', 
          color: '#991b1b',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {acessosFiltrados.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          background: '#ffffff', 
          borderRadius: '12px',
          border: '2px dashed #e5e7eb'
        }}>
          <MdDirectionsCar size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 .5rem 0', color: '#374151' }}>Nenhum acesso encontrado</h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '.875rem' }}>
            {filtro === 'ativos' && 'Não há veículos ativos no momento'}
            {filtro === 'encerrados' && 'Nenhum acesso encerrado registrado'}
            {filtro === 'todos' && 'Nenhum acesso registrado'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {acessosFiltrados.map(acesso => {
            const isAtivo = !acesso.horaDeSaida;
            const statusColor = getStatusColor(acesso);

            return (
              <div 
                key={acesso.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: `2px solid ${isAtivo ? '#10b981' : '#e5e7eb'}`,
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto auto auto',
                  gap: '2rem',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Indicador de status */}
                {isAtivo && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: statusColor,
                    animation: 'pulse 2s ease-in-out infinite'
                  }} />
                )}

                {/* Placa */}
                <div style={{ 
                  background: isAtivo ? '#10b981' : '#6b7280',
                  color: '#ffffff',
                  padding: '.75rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '1.25rem',
                  letterSpacing: '2px',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  minWidth: '140px'
                }}>
                  {acesso.placaDoCarro}
                </div>

                {/* Informações de horário */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                    <MdPlayArrow size={20} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '.875rem', color: '#6b7280' }}>Entrada:</span>
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                      {formatarTempo(acesso.horaDeEntrada)}
                    </span>
                  </div>
                  
                  {acesso.horaDeSaida ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <MdExitToApp size={20} style={{ color: '#ef4444' }} />
                      <span style={{ fontSize: '.875rem', color: '#6b7280' }}>Saída:</span>
                      <span style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                        {formatarTempo(acesso.horaDeSaida)}
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <MdAccessTime size={20} style={{ color: '#3b82f6' }} />
                      <span style={{ fontSize: '.875rem', color: '#6b7280' }}>Tempo:</span>
                      <span style={{ fontSize: '1rem', fontWeight: '600', color: '#3b82f6' }}>
                        {calcularTempoDecorrido(acesso.horaDeEntrada)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tempo Total */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '.75rem', color: '#6b7280', marginBottom: '.25rem' }}>
                    Total de Horas
                  </div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.25rem'
                  }}>
                    <MdAccessTime size={24} style={{ color: '#6b7280' }} />
                    {acesso.totalHoras ? `${acesso.totalHoras}h` : '—'}
                  </div>
                </div>

                {/* Valor */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '.75rem', color: '#6b7280', marginBottom: '.25rem' }}>
                    Valor a Pagar
                  </div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.25rem'
                  }}>
                    <MdAttachMoney size={24} />
                    {acesso.valorAPagar ? `R$ ${acesso.valorAPagar.toFixed(2)}` : '—'}
                  </div>
                </div>

                {/* Badge de Status */}
                <div style={{
                  padding: '.5rem 1rem',
                  borderRadius: '9999px',
                  background: isAtivo ? '#d1fae5' : '#f3f4f6',
                  color: isAtivo ? '#065f46' : '#6b7280',
                  fontSize: '.875rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '.5rem',
                  whiteSpace: 'nowrap'
                }}>
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

      {/* CSS para animações */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default AcessosDono;
