import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MdStar, MdStarBorder, MdArrowBack, MdCheckCircle } from 'react-icons/md';
import { reservaService, estacionamentoService, avaliacaoService, usuarioService } from '../../utils/services';
import { Toast } from '../../components/shared';
import './Avaliacao.css';

const Avaliacao = () => {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dados da reserva podem vir via state ou serem buscados
  const reservaData = location.state?.reserva;

  const [avaliacao, setAvaliacao] = useState({
    nota: 0,
    comentario: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [estacionamento, setEstacionamento] = useState(null);
  const [reserva, setReserva] = useState(null);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState('');


  useEffect(() => {
    const buscarDadosReserva = async () => {
      setLoadingData(true);
      setError('');
      
      try {
        // 1. Buscar dados do usuário logado
        const userData = await usuarioService.getMe();
        const clienteEmail = userData?.email;
        
        if (!clienteEmail) {
          throw new Error('Não foi possível identificar o usuário');
        }

        // 2. Buscar todas as reservas do cliente
        const minhasReservas = await reservaService.getMinhasReservas(clienteEmail);
        
        // 3. Encontrar a reserva específica
        const reservaEncontrada = minhasReservas.find(r => r.id === parseInt(reservaId));
        
        if (!reservaEncontrada) {
          throw new Error('Reserva não encontrada ou você não tem permissão para avaliá-la');
        }

        // 4. Verificar se a reserva está ACEITA ou ENCERRADA
        const status = reservaEncontrada.statusReserva || reservaEncontrada.status;
        if (!['ACEITA', 'ENCERRADA', 'EM_USO'].includes(status)) {
          throw new Error('Apenas reservas aceitas ou finalizadas podem ser avaliadas');
        }

        setReserva(reservaEncontrada);

        // 5. Buscar dados do estacionamento
        const estacionamentoId = reservaEncontrada.estacionamento?.id || 
                                 reservaEncontrada.estacionamentoId || 
                                 reservaEncontrada.idEstacionamento;
        
        if (!estacionamentoId) {
          throw new Error('Estacionamento não identificado nesta reserva');
        }

        const estacionamentoData = await estacionamentoService.getById(estacionamentoId);
        setEstacionamento(estacionamentoData);

      } catch (e) {
        console.error('Erro ao buscar dados da reserva:', e);
        setError(e.message || 'Erro ao carregar dados da reserva');
        setToast({ 
          message: e.message || 'Erro ao carregar dados', 
          type: 'error' 
        });
      } finally {
        setLoadingData(false);
      }
    };

    buscarDadosReserva();
  }, [reservaId]);

  const handleStarClick = (nota) => {
    setAvaliacao(prev => ({
      ...prev,
      nota
    }));
  };

  const handleComentarioChange = (e) => {
    const valor = e.target.value;
    if (valor.length <= 500) {
      setAvaliacao(prev => ({
        ...prev,
        comentario: valor
      }));
    }
  };

  const handleEnviarAvaliacao = async () => {
    if (avaliacao.nota === 0) {
      setToast({ 
        message: 'Por favor, selecione uma nota de 1 a 5 estrelas', 
        type: 'error' 
      });
      return;
    }

    setLoading(true);
    try {
      // Buscar dados do usuário para pegar o ID do cliente
      const userData = await usuarioService.getMe();
      
      // Preparar payload para o backend
      const avaliacaoPayload = {
        clienteId: userData.id,
        estacionamentoId: estacionamento.id,
        nota: avaliacao.nota,
        comentario: avaliacao.comentario || null,
        dataDeAvaliacao: new Date().toISOString()
      };

      await avaliacaoService.create(avaliacaoPayload);
      
      setToast({ 
        message: 'Avaliação enviada com sucesso! Obrigado pelo seu feedback.', 
        type: 'success' 
      });

      // Aguardar um pouco para mostrar o toast antes de redirecionar
      setTimeout(() => {
        navigate('/minhas-avaliacoes');
      }, 1500);

    } catch (e) {
      console.error('Erro ao enviar avaliação:', e);
      setToast({ 
        message: e.message || 'Erro ao enviar avaliação. Tente novamente.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePularAvaliacao = () => {
    navigate('/minhas-reservas');
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-button ${i <= avaliacao.nota ? 'active' : ''}`}
          onClick={() => handleStarClick(i)}
        >
          {i <= avaliacao.nota ? <MdStar /> : <MdStarBorder />}
        </button>
      );
    }
    return stars;
  };

  if (loadingData) {
    return (
      <div className="avaliacao-container">
        <div className="loading">Carregando dados da reserva...</div>
      </div>
    );
  }

  if (error || !estacionamento || !reserva) {
    return (
      <div className="avaliacao-container">
        <div className="error-container">
          <h2>Erro ao carregar avaliação</h2>
          <p>{error || 'Não foi possível carregar os dados da reserva'}</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/minhas-reservas')}
          >
            Voltar para Minhas Reservas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="avaliacao-container">
      <div className="avaliacao-header">
        <div className="header-top">
          <button className="back-button" onClick={() => navigate('/minhas-reservas')}>
            <MdArrowBack />
          </button>
          <h1>
            <MdStar />
            Avalie sua Experiência
          </h1>
        </div>
        <p className="header-subtitle">
          Sua opinião é muito importante para nós e outros usuários
        </p>
      </div>

      <div className="avaliacao-content">
        <div className="estacionamento-info">
          <h2>{estacionamento.nome}</h2>
          <p>{estacionamento.endereco}, {estacionamento.numero}</p>
          <p className="reserva-info">
            Reserva #{String(reserva.id).padStart(4, '0')}
          </p>
        </div>

        <form className="avaliacao-form">
          {/* Rating de Estrelas */}
          <div className="form-group">
            <label className="required">Como você avalia este estacionamento?</label>
            <div className="rating-container">
              <div className="stars">
                {renderStars()}
              </div>
              <span className="rating-text">
                {avaliacao.nota > 0 ? `${avaliacao.nota} de 5 estrelas` : 'Selecione uma nota'}
              </span>
            </div>
          </div>

          {/* Comentário */}
          <div className="form-group">
            <label htmlFor="comentario">Comentário (opcional)</label>
            <textarea
              id="comentario"
              value={avaliacao.comentario}
              onChange={handleComentarioChange}
              placeholder="Conte-nos mais sobre sua experiência..."
              rows={4}
            />
            <span className="char-count">{avaliacao.comentario.length}/500</span>
          </div>
        </form>

        <div className="action-buttons">
          <button
            type="button"
            className="btn-secondary"
            onClick={handlePularAvaliacao}
            disabled={loading}
          >
            Pular
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleEnviarAvaliacao}
            disabled={loading || avaliacao.nota === 0}
          >
            {loading ? 'Enviando...' : 'Enviar Avaliação'}
          </button>
        </div>
      </div>

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

export default Avaliacao;