import React from 'react';
import './ReservasTable.css';

const ReservasTable = ({ 
  reservas = [], 
  onAceitar, 
  onRecusar, 
  loading = false,
  showActions = true,
  compact = false 
}) => {
  
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '—';
    // Se vier no formato HH:MM:SS, pega apenas HH:MM
    if (timeString.includes(':')) {
      const parts = timeString.split(':');
      return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'PENDENTE': 'status-pendente',
      'ACEITA': 'status-aceita',
      'RECUSADA': 'status-recusada',
      'ENCERRADA': 'status-encerrada',
      'CANCELADA': 'status-cancelada'
    };
    return statusMap[status?.toUpperCase()] || 'status-default';
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      'PENDENTE': 'Pendente',
      'ACEITA': 'Aceita',
      'RECUSADA': 'Recusada',
      'ENCERRADA': 'Encerrada',
      'CANCELADA': 'Cancelada'
    };
    return labelMap[status?.toUpperCase()] || status;
  };

  if (loading) {
    return <div className="reservas-table-loading">Carregando reservas...</div>;
  }

  if (!reservas || reservas.length === 0) {
    return <div className="reservas-table-empty">Nenhuma reserva encontrada.</div>;
  }

  return (
    <div className={`reservas-table-container ${compact ? 'compact' : ''}`}>
      <table className="reservas-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Estacionamento</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Valor</th>
            <th>Status</th>
            {showActions && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td className="td-id">#{reserva.id?.toString().padStart(4, '0')}</td>
              <td>{reserva.cliente?.nome || reserva.clienteNome || '—'}</td>
              <td>{reserva.estacionamento?.nome || reserva.estacionamentoNome || '—'}</td>
              <td>{formatDate(reserva.dataDaReserva)}</td>
              <td>{formatTime(reserva.horaDaReserva)}</td>
              <td className="td-valor">
                {reserva.valorTotal 
                  ? `R$ ${Number(reserva.valorTotal).toFixed(2).replace('.', ',')}` 
                  : reserva.valor 
                  ? `R$ ${Number(reserva.valor).toFixed(2).replace('.', ',')}` 
                  : '—'}
              </td>
              <td>
                <span className={`status-badge ${getStatusClass(reserva.statusReserva || reserva.status)}`}>
                  {getStatusLabel(reserva.statusReserva || reserva.status)}
                </span>
              </td>
              {showActions && (
                <td className="td-actions">
                  {(reserva.statusReserva === 'PENDENTE' || reserva.status === 'PENDENTE') ? (
                    <div className="action-buttons">
                      <button 
                        className="btn-accept" 
                        onClick={() => onAceitar && onAceitar(reserva)}
                        disabled={loading}
                      >
                        Aceitar
                      </button>
                      <button 
                        className="btn-reject" 
                        onClick={() => onRecusar && onRecusar(reserva)}
                        disabled={loading}
                      >
                        Recusar
                      </button>
                    </div>
                  ) : (
                    <span className="no-action">—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservasTable;
