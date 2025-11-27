import React, { useEffect, useState, useCallback } from 'react';
import { donoService } from '../../utils/services';
import { Toast, Modal, ModalFooter, ModalActions, Button, PageHeader } from '../../components/shared';
import { MdFilterList, MdRefresh } from 'react-icons/md';

const ReservasDono = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDENTE');
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Estados dos modais
  const [approveModal, setApproveModal] = useState({ isOpen: false, reserva: null });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, reserva: null });

  const fetchReservas = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await donoService.getReservas();
      let list = Array.isArray(data) ? data : (data.content || []);
      
      // Filtrar no cliente por statusReserva
      if (statusFilter && Array.isArray(list)) {
        list = list.filter(r => {
          const status = (r.statusReserva || r.status || '').toUpperCase();
          return status === statusFilter;
        });
      }
      
      setReservas(list);
    } catch (e) {
      console.error('Erro ao carregar reservas:', e);
      setError(e.message || 'Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  const handleApprove = async (reserva) => {
    setActionLoading(reserva.id);
    try {
      // Passar a reserva completa em vez de apenas o ID
      await donoService.aprovarReserva(reserva.id, reserva);
      setToast({ message: 'Reserva aprovada com sucesso', type: 'success' });
      
      // Sinalizar mudança para outros componentes
      window.dispatchEvent(new Event('reservaUpdated'));
      
      // Recarregar as reservas para atualizar a lista
      await fetchReservas();
      
      setApproveModal({ isOpen: false, reserva: null });
    } catch (e) {
      setToast({ message: e.message || 'Erro ao aprovar reserva', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reserva) => {
    setActionLoading(reserva.id);
    try {
      // Passar a reserva completa em vez de apenas o ID
      await donoService.rejeitarReserva(reserva.id, reserva);
      setToast({ message: 'Reserva recusada', type: 'warning' });
      
      // Sinalizar mudança para outros componentes
      window.dispatchEvent(new Event('reservaUpdated'));
      
      // Recarregar as reservas para atualizar a lista
      await fetchReservas();
      
      setRejectModal({ isOpen: false, reserva: null });
    } catch (e) {
      setToast({ message: e.message || 'Erro ao recusar reserva', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const openApproveModal = (reserva) => {
    setApproveModal({ isOpen: true, reserva });
  };

  const openRejectModal = (reserva) => {
    setRejectModal({ isOpen: true, reserva });
  };

  const closeApproveModal = () => {
    if (actionLoading) return;
    setApproveModal({ isOpen: false, reserva: null });
  };

  const closeRejectModal = () => {
    if (actionLoading) return;
    setRejectModal({ isOpen: false, reserva: null });
  };

  const statusClasses = {
    PENDENTE: '#f59e0b',
    ACEITA: '#10b981',
    RECUSADA: '#ef4444',
    ENCERRADA: '#6b7280'
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <PageHeader
        title="Transações"
        subtitle="Gerencie as reservas recebidas nos seus estacionamentos"
        actions={
          <div style={{ display: 'flex', gap: '.5rem' }}>
            {['PENDENTE', 'ACEITA', 'RECUSADA', 'ENCERRADA'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  background: statusFilter === s ? '#111827' : '#ffffff',
                  color: statusFilter === s ? '#ffffff' : '#374151',
                  cursor: 'pointer',
                  fontSize: '.75rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
              >{s}</button>
            ))}
          </div>
        }
      />
      
      <div style={{ padding: '0 2rem 2rem 2rem' }}>
      {loading && <p>Carregando reservas...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {!loading && reservas.length === 0 && !error && (
        <p>Nenhuma reserva encontrada para o filtro selecionado.</p>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['ID', 'Cliente', 'Estacionamento', 'Vaga', 'Data', 'Hora', 'Valor', 'Status', 'Ações'].map(h => (
                <th key={h} style={{ padding: '.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '11px', letterSpacing: '.05em', textTransform: 'uppercase', color: '#6b7280' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservas.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '.75rem', color: '#6b7280' }}>#{String(r.id).padStart(4,'0')}</td>
                <td style={{ padding: '.75rem' }}>{r.cliente?.nome || r.clienteNome || '—'}</td>
                <td style={{ padding: '.75rem' }}>{r.estacionamento?.nome || r.estacionamentoNome || '—'}</td>
                <td style={{ padding: '.75rem' }}>{r.vagaCodigo || r.vaga || '—'}</td>
                <td style={{ padding: '.75rem' }}>{r.dataDaReserva || '—'}</td>
                <td style={{ padding: '.75rem' }}>{r.horaDaReserva || '—'}</td>
                <td style={{ padding: '.75rem' }}>{typeof r.valorTotal === 'number' ? `R$ ${r.valorTotal.toFixed(2)}` : (r.valor ? `R$ ${Number(r.valor).toFixed(2)}` : '—')}</td>
                <td style={{ padding: '.75rem' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '.35rem .6rem',
                    borderRadius: '6px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    color: statusClasses[(r.statusReserva || r.status)] || '#374151',
                    fontWeight: 600,
                    fontSize: '.65rem'
                  }}>{r.statusReserva || r.status}</span>
                </td>
                <td style={{ padding: '.75rem' }}>
                  {(r.statusReserva || r.status) === 'PENDENTE' ? (
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <button
                        onClick={() => openApproveModal(r)}
                        disabled={actionLoading === r.id}
                        style={{
                          padding: '.5rem .75rem',
                          background: '#10b981',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '.65rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          opacity: actionLoading === r.id ? .6 : 1
                        }}>Aceitar</button>
                      <button
                        onClick={() => openRejectModal(r)}
                        disabled={actionLoading === r.id}
                        style={{
                          padding: '.5rem .75rem',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '.65rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          opacity: actionLoading === r.id ? .6 : 1
                        }}>Recusar</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '.65rem', color: '#6b7280' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modal de Aprovar Reserva */}
      <Modal
        isOpen={approveModal.isOpen}
        onClose={closeApproveModal}
        title="Aprovar Reserva"
        size="md"
      >
        {approveModal.reserva && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '1rem', color: '#374151' }}>
                Confirma a aprovação desta reserva?
              </p>
              
              <div style={{ 
                background: '#f9fafb', 
                padding: '1rem', 
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'grid', gap: '.75rem', fontSize: '14px' }}>
                  <div>
                    <strong style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>ID</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#111827' }}>#{String(approveModal.reserva.id).padStart(4, '0')}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Cliente</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#111827' }}>{approveModal.reserva.cliente?.nome || '—'}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Estacionamento</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#111827' }}>{approveModal.reserva.estacionamento?.nome || '—'}</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <strong style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Data</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#111827' }}>{approveModal.reserva.dataDaReserva || '—'}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Hora</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#111827' }}>{approveModal.reserva.horaDaReserva || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ModalFooter>
              <ModalActions>
                <Button
                  variant="secondary"
                  onClick={closeApproveModal}
                  disabled={actionLoading === approveModal.reserva.id}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleApprove(approveModal.reserva)}
                  disabled={actionLoading === approveModal.reserva.id}
                  style={{ background: '#10b981', borderColor: '#10b981' }}
                >
                  {actionLoading === approveModal.reserva.id ? 'Aprovando...' : 'Confirmar Aprovação'}
                </Button>
              </ModalActions>
            </ModalFooter>
          </>
        )}
      </Modal>

      {/* Modal de Recusar Reserva */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={closeRejectModal}
        title="Recusar Reserva"
        size="md"
      >
        {rejectModal.reserva && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '1rem', color: '#374151' }}>
                Confirma a recusa desta reserva?
              </p>
              
              <div style={{ 
                background: '#fef2f2', 
                padding: '1rem', 
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                <div style={{ display: 'grid', gap: '.75rem', fontSize: '14px' }}>
                  <div>
                    <strong style={{ color: '#991b1b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>ID</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#111827' }}>#{String(rejectModal.reserva.id).padStart(4, '0')}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#991b1b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Cliente</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#111827' }}>{rejectModal.reserva.cliente?.nome || '—'}</p>
                  </div>
                  <div>
                    <strong style={{ color: '#991b1b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Estacionamento</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#111827' }}>{rejectModal.reserva.estacionamento?.nome || '—'}</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <strong style={{ color: '#991b1b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Data</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#111827' }}>{rejectModal.reserva.dataDaReserva || '—'}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#991b1b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Hora</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#111827' }}>{rejectModal.reserva.horaDaReserva || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ marginTop: '1rem', fontSize: '13px', color: '#dc2626' }}>
                Esta ação não pode ser desfeita.
              </p>
            </div>

            <ModalFooter>
              <ModalActions>
                <Button
                  variant="secondary"
                  onClick={closeRejectModal}
                  disabled={actionLoading === rejectModal.reserva.id}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleReject(rejectModal.reserva)}
                  disabled={actionLoading === rejectModal.reserva.id}
                >
                  {actionLoading === rejectModal.reserva.id ? 'Recusando...' : 'Confirmar Recusa'}
                </Button>
              </ModalActions>
            </ModalFooter>
          </>
        )}
      </Modal>
      </div>
    </div>
  );
};

export default ReservasDono;
