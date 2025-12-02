import React, { useEffect, useState, useCallback } from 'react';
import { donoService } from '../../utils/services';
import { Toast, Modal, ModalFooter, ModalActions, Button, Header, ReservasTable } from '../../components/shared';
import { MdFilterList, MdRefresh } from 'react-icons/md';
import './ReservasDono.css';

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
    <div className="reservas-dono-container">
      <Header
        title="Gerenciar Reservas"
        subtitle="Gerencie as reservas recebidas nos seus estacionamentos"
        actions={
          <div className="header-actions">
            {['PENDENTE', 'ACEITA', 'RECUSADA', 'ENCERRADA'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
              >{s}</button>
            ))}
          </div>
        }
      />
      
      <div className="reservas-content">
        <ReservasTable 
          reservas={reservas}
          loading={loading}
          onAceitar={openApproveModal}
          onRecusar={openRejectModal}
        />
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
              <p className="modal-confirm-text">
                Confirma a aprovação desta reserva?
              </p>
              
              <div className="modal-details-box">
                <div className="modal-details-grid">
                  <div>
                    <strong className="detail-label">ID</strong>
                    <p className="detail-value">#{String(approveModal.reserva.id).padStart(4, '0')}</p>
                  </div>
                  <div>
                    <strong className="detail-label">Cliente</strong>
                    <p className="detail-value">{approveModal.reserva.cliente?.nome || '—'}</p>
                  </div>
                  <div>
                    <strong className="detail-label">Estacionamento</strong>
                    <p className="detail-value">{approveModal.reserva.estacionamento?.nome || '—'}</p>
                  </div>
                  <div className="detail-row">
                    <div>
                      <strong className="detail-label">Data</strong>
                      <p className="detail-value">{approveModal.reserva.dataDaReserva || '—'}</p>
                    </div>
                    <div>
                      <strong className="detail-label">Hora</strong>
                      <p className="detail-value">{approveModal.reserva.horaDaReserva || '—'}</p>
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
                  className="btn-confirm-approve"
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
              <p className="modal-confirm-text">
                Confirma a recusa desta reserva?
              </p>
              
              <div className="modal-details-box reject">
                <div className="modal-details-grid">
                  <div>
                    <strong className="detail-label reject">ID</strong>
                    <p className="detail-value">#{String(rejectModal.reserva.id).padStart(4, '0')}</p>
                  </div>
                  <div>
                    <strong className="detail-label reject">Cliente</strong>
                    <p className="detail-value">{rejectModal.reserva.cliente?.nome || '—'}</p>
                  </div>
                  <div>
                    <strong className="detail-label reject">Estacionamento</strong>
                    <p className="detail-value">{rejectModal.reserva.estacionamento?.nome || '—'}</p>
                  </div>
                  <div className="detail-row">
                    <div>
                      <strong className="detail-label reject">Data</strong>
                      <p className="detail-value">{rejectModal.reserva.dataDaReserva || '—'}</p>
                    </div>
                    <div>
                      <strong className="detail-label reject">Hora</strong>
                      <p className="detail-value">{rejectModal.reserva.horaDaReserva || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="warning-text">
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
  );
};

export default ReservasDono;
