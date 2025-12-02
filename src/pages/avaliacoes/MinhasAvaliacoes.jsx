import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdStar, 
  MdStarBorder, 
  MdDelete, 
  MdCalendarToday,
  MdThumbUp,
  MdThumbDown
} from 'react-icons/md';
import { avaliacaoService, usuarioService } from '../../utils/services';
import { Toast, Header, Modal, ModalFooter, ModalActions, Button } from '../../components/shared';
import parkingPhoto from '../../assets/parking-photo-mock.jpg';
import './MinhasAvaliacoes.css';

const MinhasAvaliacoes = () => {
  const navigate = useNavigate();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avaliacaoToDelete, setAvaliacaoToDelete] = useState(null);

  useEffect(() => {
    fetchAvaliacoes();
  }, []);

  const fetchAvaliacoes = async () => {
    setLoading(true);
    setToast(null);
    try {
      const userData = await usuarioService.getMe();
      const clienteId = userData.id;
      
      const minhasAvaliacoes = await avaliacaoService.getMinhasAvaliacoes(clienteId);
      setAvaliacoes(minhasAvaliacoes);
    } catch (e) {
      console.error('Erro ao carregar avaliações:', e);
      setToast({ message: e.message || 'Erro ao carregar avaliações', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (avaliacaoId) => {
    setAvaliacaoToDelete(avaliacaoId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!avaliacaoToDelete) return;

    try {
      console.log(`Excluindo avaliação ${avaliacaoToDelete}...`);
      await avaliacaoService.delete(avaliacaoToDelete);
      setToast({ message: 'Avaliação excluída com sucesso!', type: 'success' });
      console.log('Avaliação excluída com sucesso');
      fetchAvaliacoes();
    } catch (e) {
      console.error('Erro ao excluir avaliação:', e);
      setToast({ message: e.message || 'Erro ao excluir avaliação', type: 'error' });
    } finally {
      setShowDeleteModal(false);
      setAvaliacaoToDelete(null);
    }
  };

  const renderStars = (nota) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= nota ? (
          <MdStar key={i} style={{ color: '#f59e0b', fontSize: '20px' }} />
        ) : (
          <MdStarBorder key={i} style={{ color: '#d1d5db', fontSize: '20px' }} />
        )
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="minhas-avaliacoes-page">
        <Header 
          title="Minhas Avaliações"
          subtitle="Veja todas as avaliações que você fez sobre estacionamentos"
        />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando avaliações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="minhas-avaliacoes-page">
      <Header 
        title="Minhas Avaliações"
        subtitle="Veja todas as avaliações que você fez sobre estacionamentos"
      />

      {avaliacoes.length === 0 ? (
        <div className="no-avaliacoes">
          <MdStar size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <h3>Nenhuma avaliação encontrada</h3>
          <p>
            Você ainda não avaliou nenhum estacionamento
          </p>
          <button
            onClick={() => navigate('/estacionamentos')}
            className="btn-search"
          >
            Buscar Estacionamentos
          </button>
        </div>
      ) : (
        <div className="avaliacoes-grid">
          {avaliacoes.map(avaliacao => {
            const estacionamento = avaliacao.estacionamento || {};
            const fotoEstacionamento = estacionamento.foto || estacionamento.imagem || parkingPhoto;
            
            return (
            <div
              key={avaliacao.id}
              className="avaliacao-card"
            >
              <div className="card-image-container">
                <img 
                  src={fotoEstacionamento} 
                  alt={estacionamento.nome || 'Estacionamento'} 
                  className="card-image"
                  onError={(e) => { e.target.src = parkingPhoto; }}
                />
                <div className="card-date-badge">
                  <MdCalendarToday size={14} />
                  <span>{formatDate(avaliacao.dataDeAvaliacao || avaliacao.data || avaliacao.createdAt)}</span>
                </div>
              </div>

              <div className="card-content">
                {/* Header do Card */}
                <div className="card-header">
                  <div className="estacionamento-info">
                    <h3 className="estacionamento-name">
                      {estacionamento.nome || avaliacao.estacionamentoNome || 'Estacionamento'}
                    </h3>
                  </div>
                </div>

                {/* Nota com estrelas */}
                <div className="rating-display">
                  <div className="stars-container">
                    {renderStars(avaliacao.nota || 0)}
                  </div>
                  <span className="rating-value">
                    {avaliacao.nota || 0}/5
                  </span>
                </div>

                {/* Comentário */}
                {avaliacao.comentario && (
                  <div className="comment-box">
                    "{avaliacao.comentario}"
                  </div>
                )}

                {/* Recomendaria */}
                {avaliacao.recomendaria !== null && avaliacao.recomendaria !== undefined && (
                  <div className={`recommendation-badge ${avaliacao.recomendaria ? 'positive' : 'negative'}`}>
                    {avaliacao.recomendaria ? (
                      <>
                        <MdThumbUp style={{ fontSize: '16px' }} />
                        <span>Recomendo</span>
                      </>
                    ) : (
                      <>
                        <MdThumbDown style={{ fontSize: '16px' }} />
                        <span>Não recomendo</span>
                      </>
                    )}
                  </div>
                )}

                {/* Detalhes da experiência */}
                {avaliacao.detalhesExperiencia && avaliacao.detalhesExperiencia.length > 0 && (
                  <div className="tags-container">
                    {avaliacao.detalhesExperiencia.map((detalhe, idx) => (
                      <span key={idx} className="tag">
                        {detalhe}
                      </span>
                    ))}
                  </div>
                )}

                {/* Ações */}
                <div className="card-actions">
                  <button
                    onClick={() => confirmDelete(avaliacao.id)}
                    className="btn-delete"
                  >
                    <MdDelete size={18} />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Excluir Avaliação"
      >
        <p>Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.</p>
        <ModalFooter>
          <ModalActions>
            <Button 
              variant="secondary" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </ModalActions>
        </ModalFooter>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MinhasAvaliacoes;
