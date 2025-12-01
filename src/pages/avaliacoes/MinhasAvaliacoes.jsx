import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdStar, 
  MdStarBorder, 
  MdEdit, 
  MdDelete, 
  MdLocationOn,
  MdCalendarToday,
  MdThumbUp,
  MdThumbDown
} from 'react-icons/md';
import { avaliacaoService, usuarioService } from '../../utils/services';
import { Toast, Header } from '../../components/shared';
import './MinhasAvaliacoes.css';

const MinhasAvaliacoes = () => {
  const navigate = useNavigate();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAvaliacoes();
  }, []);

  const fetchAvaliacoes = async () => {
    setLoading(true);
    setError('');
    try {
      const userData = await usuarioService.getMe();
      const clienteId = userData.id;
      
      const minhasAvaliacoes = await avaliacaoService.getMinhasAvaliacoes(clienteId);
      setAvaliacoes(minhasAvaliacoes);
    } catch (e) {
      console.error('Erro ao carregar avaliações:', e);
      setError(e.message || 'Erro ao carregar avaliações');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (avaliacaoId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      return;
    }

    try {
      await avaliacaoService.delete(avaliacaoId);
      setToast({ message: 'Avaliação excluída com sucesso!', type: 'success' });
      fetchAvaliacoes();
    } catch (e) {
      console.error('Erro ao excluir avaliação:', e);
      setToast({ message: e.message || 'Erro ao excluir avaliação', type: 'error' });
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



  return (
    <div className="minhas-avaliacoes-page">
      <Header 
        title="Minhas Avaliações"
        subtitle="Veja todas as avaliações que você fez sobre estacionamentos"
      />

      {error && (
        <div className="error-container" style={{
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

      {avaliacoes.length === 0 && !error ? (
        <div className="no-avaliacoes" style={{
          textAlign: 'center',
          padding: '3rem',
          background: '#ffffff',
          borderRadius: '12px',
          border: '2px dashed #e5e7eb'
        }}>
          <MdStar size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 .5rem 0', color: '#374151' }}>Nenhuma avaliação encontrada</h3>
          <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280', fontSize: '.875rem' }}>
            Você ainda não avaliou nenhum estacionamento
          </p>
          <button
            onClick={() => navigate('/estacionamentos')}
            style={{
              padding: '.75rem 1.5rem',
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Buscar Estacionamentos
          </button>
        </div>
      ) : (
        <div className="avaliacoes-grid" style={{
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
        }}>
          {avaliacoes.map(avaliacao => (
            <div
              key={avaliacao.id}
              className="avaliacao-card"
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                padding: '1.5rem',
                transition: 'all 0.2s'
              }}
            >
              {/* Header do Card */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.5rem' }}>
                  <MdLocationOn style={{ color: '#6b7280', fontSize: '18px' }} />
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                    {avaliacao.estacionamento?.nome || avaliacao.estacionamentoNome || 'Estacionamento'}
                  </h3>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.875rem', color: '#6b7280' }}>
                  <MdCalendarToday size={16} />
                  <span>{formatDate(avaliacao.dataDeAvaliacao || avaliacao.data || avaliacao.createdAt)}</span>
                </div>
              </div>

              {/* Nota com estrelas */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  {renderStars(avaliacao.nota || 0)}
                  <span style={{ fontSize: '.875rem', fontWeight: '600', color: '#374151', marginLeft: '.5rem' }}>
                    {avaliacao.nota || 0}/5
                  </span>
                </div>
              </div>

              {/* Comentário */}
              {avaliacao.comentario && (
                <div style={{
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '.875rem',
                  color: '#374151',
                  lineHeight: '1.5'
                }}>
                  "{avaliacao.comentario}"
                </div>
              )}

              {/* Recomendaria */}
              {avaliacao.recomendaria !== null && avaliacao.recomendaria !== undefined && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '.5rem',
                  padding: '.75rem',
                  background: avaliacao.recomendaria ? '#d1fae5' : '#fee2e2',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  {avaliacao.recomendaria ? (
                    <>
                      <MdThumbUp style={{ color: '#065f46', fontSize: '18px' }} />
                      <span style={{ fontSize: '.875rem', fontWeight: '600', color: '#065f46' }}>
                        Você recomenda este local
                      </span>
                    </>
                  ) : (
                    <>
                      <MdThumbDown style={{ color: '#991b1b', fontSize: '18px' }} />
                      <span style={{ fontSize: '.875rem', fontWeight: '600', color: '#991b1b' }}>
                        Você não recomenda este local
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Detalhes da experiência */}
              {avaliacao.detalhesExperiencia && avaliacao.detalhesExperiencia.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '.5rem'
                  }}>
                    {avaliacao.detalhesExperiencia.map((detalhe, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '.375rem .75rem',
                          background: '#e0f2fe',
                          color: '#0369a1',
                          borderRadius: '9999px',
                          fontSize: '.75rem',
                          fontWeight: '500'
                        }}
                      >
                        {detalhe}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações */}
              <div style={{
                display: 'flex',
                gap: '.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  onClick={() => handleDelete(avaliacao.id)}
                  style={{
                    flex: 1,
                    padding: '.625rem',
                    background: '#ffffff',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    borderRadius: '6px',
                    fontSize: '.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '.5rem'
                  }}
                >
                  <MdDelete size={18} />
                  Excluir
                </button>
              </div>
            </div>
          ))}
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
  );
};

export default MinhasAvaliacoes;
