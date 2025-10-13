import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MdStar, MdStarBorder, MdArrowBack, MdCheckCircle } from 'react-icons/md';
import './Avaliacao.css';

const Avaliacao = () => {
  const { reservaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dados da reserva podem vir via state ou serem buscados
  const reservaData = location.state?.reserva;

  const [avaliacao, setAvaliacao] = useState({
    nota: 0,
    comentario: '',
    recomendaria: null,
    detalhesExperiencia: []
  });
  
  const [loading, setLoading] = useState(false);
  const [estacionamento, setEstacionamento] = useState(null);

  // Opções para detalhes da experiência
  const opcoes = [
    'Atendimento Rápido',
    'Local Limpo',
    'Fácil Acesso',
    'Segurança Adequada',
    'Preço Justo',
    'Dificuldade de Vaga',
    'Local Sujo',
    'Atendimento Demorado'
  ];

  useEffect(() => {
    // Buscar dados do estacionamento da reserva
    const buscarDadosReserva = async () => {
      try {
        if (reservaData) {
          setEstacionamento(reservaData.estacionamento);
        } else {
          // Simular busca de dados da reserva
          const mockReserva = {
            id: reservaId,
            estacionamento: {
              id: 1,
              nome: 'Shopping Center Norte',
              endereco: 'Av. Paulista, 1000'
            }
          };
          setEstacionamento(mockReserva.estacionamento);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da reserva:', error);
      }
    };

    buscarDadosReserva();
  }, [reservaId, reservaData]);

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

  const handleRecomendacaoChange = (valor) => {
    setAvaliacao(prev => ({
      ...prev,
      recomendaria: valor
    }));
  };

  const handleDetalheChange = (opcao) => {
    setAvaliacao(prev => {
      const detalhes = prev.detalhesExperiencia.includes(opcao)
        ? prev.detalhesExperiencia.filter(item => item !== opcao)
        : [...prev.detalhesExperiencia, opcao];
      
      return {
        ...prev,
        detalhesExperiencia: detalhes
      };
    });
  };

  const handleEnviarAvaliacao = async () => {
    if (avaliacao.nota === 0) {
      alert('Por favor, selecione uma nota de 1 a 5 estrelas.');
      return;
    }

    setLoading(true);
    try {
      // Aqui seria feita a integração com a API real
      console.log('Enviando avaliação:', {
        reservaId,
        estacionamentoId: estacionamento?.id,
        ...avaliacao
      });

      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Avaliação enviada com sucesso! Obrigado pelo seu feedback.');
      navigate('/minhas-reservas');
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
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

  if (!estacionamento) {
    return (
      <div className="avaliacao-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="avaliacao-container">
      <div className="avaliacao-header">
        <button className="back-button" onClick={() => navigate('/minhas-reservas')}>
          <MdArrowBack />
        </button>
        <h1>Avalie sua Experiência</h1>
      </div>

      <div className="avaliacao-content">
        <div className="estacionamento-info">
          <h2>{estacionamento.nome}</h2>
          <p>{estacionamento.endereco}</p>
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

          {/* Recomendação */}
          <div className="form-group">
            <label>Você recomendaria este estacionamento aos seus amigos?</label>
            <div className="recommendation-buttons">
              <button
                type="button"
                className={`rec-button ${avaliacao.recomendaria === true ? 'active' : ''}`}
                onClick={() => handleRecomendacaoChange(true)}
              >
                <MdCheckCircle />
                Sim
              </button>
              <button
                type="button"
                className={`rec-button ${avaliacao.recomendaria === false ? 'active' : ''}`}
                onClick={() => handleRecomendacaoChange(false)}
              >
                Não
              </button>
            </div>
          </div>

          {/* Detalhes da Experiência */}
          <div className="form-group">
            <label>Detalhes da sua experiência (opcional)</label>
            <div className="experience-options">
              {opcoes.map((opcao) => (
                <label key={opcao} className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={avaliacao.detalhesExperiencia.includes(opcao)}
                    onChange={() => handleDetalheChange(opcao)}
                  />
                  <span className="checkmark"></span>
                  {opcao}
                </label>
              ))}
            </div>
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
    </div>
  );
};

export default Avaliacao;