import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth, getAuthHeaders } from '../../utils/auth'
import { 
  MdLocationOn, 
  MdAccessTime, 
  MdDirectionsCar, 
  MdLocalParking,
  MdStar,
  MdPhone,
  MdMap,
  MdSecurity,
  MdWifi,
  MdAccessibleForward,
  MdCleaningServices,
  MdAttachMoney,
  MdPayment,
  MdSchedule,
  MdChevronLeft,
  MdChevronRight,
  MdMyLocation,
  MdRateReview
} from 'react-icons/md'
import './DetalhesEstacionamento.css'

const DetalhesEstacionamento = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [estacionamento, setEstacionamento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [avaliacoes, setAvaliacoes] = useState([])

  const API_BASE = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    fetchEstacionamentoDetalhes()
  }, [id])

  const fetchEstacionamentoDetalhes = async () => {
    try {
      setLoading(true)
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }

      const response = await fetch(`${API_BASE}/estacionamentos/${id}`, {
        method: 'GET',
        headers
      })

      if (response.ok) {
        const data = await response.json()
        setEstacionamento(data)
      } else {
        throw new Error('Estacionamento não encontrado')
      }
    } catch (err) {
      console.error('Erro ao carregar detalhes, usando mock:', err)
      // Mock data detalhado
     

      // Mock avaliacoes
      setAvaliacoes([
        {
          id: 1,
          usuario: "Maria S.",
          nota: 5,
          comentario: "Excelente localização e atendimento. Sempre tem vaga disponível!",
          data: "2025-10-06"
        },
        {
          id: 2,
          usuario: "João P.",
          nota: 4,
          comentario: "Bom estacionamento, preço justo. Só poderia ter mais vagas cobertas.",
          data: "2025-10-05"
        },
        {
          id: 3,
          usuario: "Ana C.",
          nota: 5,
          comentario: "Seguro e bem localizado. Recomendo!",
          data: "2025-10-03"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return '--:--'
    return timeString.substring(0, 5)
  }

  const isAberto = () => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    if (estacionamento?.horarioAbertura && estacionamento?.horarioFechamento) {
      const [abreHora, abreMinuto] = estacionamento.horarioAbertura.split(':').map(Number)
      const [fechaHora, fechaMinuto] = estacionamento.horarioFechamento.split(':').map(Number)
      
      const abreMinutos = abreHora * 60 + abreMinuto
      const fechaMinutos = fechaHora * 60 + fechaMinuto
      
      return currentTime >= abreMinutos && currentTime <= fechaMinutos
    }
    return true
  }

  const getVagasDisponiveis = () => {
    if (!estacionamento) return { comuns: 0, preferenciais: 0 }
    
    const comuns = estacionamento.maximoDeVagas - estacionamento.vagasPreferenciais - estacionamento.vagasOcupadas + estacionamento.vagasPreferenciaisOcupadas
    const preferenciais = estacionamento.vagasPreferenciais - estacionamento.vagasPreferenciaisOcupadas
    
    return { comuns: Math.max(0, comuns), preferenciais: Math.max(0, preferenciais) }
  }

  const getRecursoIcon = (tipo) => {
    switch (tipo) {
      case 'security': return <MdSecurity />
      case 'wash': return <MdCleaningServices />
      case 'wifi': return <MdWifi />
      case 'accessible': return <MdAccessibleForward />
      default: return <MdLocalParking />
    }
  }

  const renderStars = (nota) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MdStar 
          key={i} 
          className={i <= nota ? 'star filled' : 'star'} 
        />
      )
    }
    return stars
  }

  const nextImage = () => {
    if (estacionamento?.fotos) {
      setCurrentImageIndex((prev) => 
        prev === estacionamento.fotos.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (estacionamento?.fotos) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? estacionamento.fotos.length - 1 : prev - 1
      )
    }
  }

  const handleReservar = () => {
    // Redirecionar para tela de reserva com dados do estacionamento
    navigate(`/estacionamento/${id}/reservar`, { 
      state: { estacionamento } 
    })
  }

  const handleLigar = () => {
    if (estacionamento?.telefone) {
      window.open(`tel:${estacionamento.telefone}`)
    }
  }

  const handleRota = () => {
    if (estacionamento?.latitude && estacionamento?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${estacionamento.latitude},${estacionamento.longitude}`
      window.open(url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="detalhes-loading">
        <div className="loading-spinner"></div>
        <p>Carregando detalhes do estacionamento...</p>
      </div>
    )
  }

  if (error || !estacionamento) {
    return (
      <div className="detalhes-error">
        <h2>Estacionamento não encontrado</h2>
        <p>O estacionamento solicitado não foi encontrado ou não está disponível.</p>
        <button onClick={() => navigate('/estacionamentos')} className="btn-voltar">
          Voltar para Estacionamentos
        </button>
      </div>
    )
  }

  const vagasDisponiveis = getVagasDisponiveis()

  return (
    <div className="detalhes-estacionamento">
      {/* Header com volta */}
      <div className="detalhes-header">
        <button onClick={() => navigate('/estacionamentos')} className="btn-voltar">
          <MdChevronLeft />
          Voltar
        </button>
        <h1>Detalhes do Estacionamento</h1>
      </div>

      {/* 1. Identificação e Local */}
      <div className="secao identificacao">
        <h2>{estacionamento.nome}</h2>
        <div className="local-info">
          <div className="endereco">
            <MdLocationOn className="icon" />
            <div>
              <p className="endereco-principal">{estacionamento.endereco}</p>
              <p className="endereco-complemento">{estacionamento.cidade} - CEP: {estacionamento.CEP}</p>
            </div>
          </div>
          <div className="distancia">
            <MdMyLocation className="icon" />
            <span>{estacionamento.distancia} de você</span>
          </div>
        </div>
        <p className="descricao">{estacionamento.descricao}</p>
      </div>

      {/* 2. Mídia e Horário */}
      <div className="secao midia-horario">
        <div className="galeria">
          <h3>Fotos do Local</h3>
          <div className="galeria-container">
            <button className="galeria-nav prev" onClick={prevImage}>
              <MdChevronLeft />
            </button>
            <img 
              src={estacionamento.fotos[currentImageIndex]} 
              alt={`Foto ${currentImageIndex + 1} do estacionamento`}
              className="galeria-imagem"
            />
            <button className="galeria-nav next" onClick={nextImage}>
              <MdChevronRight />
            </button>
            <div className="galeria-indicadores">
              {estacionamento.fotos.map((_, index) => (
                <button
                  key={index}
                  className={`indicador ${index === currentImageIndex ? 'ativo' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="horario-funcionamento">
          <h3>
            <MdAccessTime className="icon" />
            Horário de Funcionamento
          </h3>
          <div className="horario-info">
            <span className="horario">
              {formatTime(estacionamento.horarioAbertura)} - {formatTime(estacionamento.horarioFechamento)}
            </span>
            <span className={`status ${isAberto() ? 'aberto' : 'fechado'}`}>
              {isAberto() ? '🟢 Aberto agora' : '🔴 Fechado agora'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Vagas e Tempo Real */}
      <div className="secao vagas-tempo-real">
        <h3>
          <MdDirectionsCar className="icon" />
          Disponibilidade em Tempo Real
        </h3>
        <div className="vagas-grid">
          <div className="vaga-tipo">
            <div className="vaga-numero">
              <span className="numero">{vagasDisponiveis.comuns}</span>
              <span className="total">/ {estacionamento.maximoDeVagas - estacionamento.vagasPreferenciais}</span>
            </div>
            <span className="vaga-label">Vagas Comuns</span>
            <div className="ocupacao-bar">
              <div 
                className="ocupacao-fill"
                style={{
                  width: `${((estacionamento.maximoDeVagas - estacionamento.vagasPreferenciais - vagasDisponiveis.comuns) / (estacionamento.maximoDeVagas - estacionamento.vagasPreferenciais)) * 100}%`
                }}
              />
            </div>
          </div>
          
          <div className="vaga-tipo preferencial">
            <div className="vaga-numero">
              <span className="numero">{vagasDisponiveis.preferenciais}</span>
              <span className="total">/ {estacionamento.vagasPreferenciais}</span>
            </div>
            <span className="vaga-label">Vagas Preferenciais</span>
            <div className="ocupacao-bar">
              <div 
                className="ocupacao-fill"
                style={{
                  width: `${(estacionamento.vagasPreferenciaisOcupadas / estacionamento.vagasPreferenciais) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tarifas e Preços */}
      <div className="secao tarifas">
        <h3>
          <MdAttachMoney className="icon" />
          Tarifas e Preços
        </h3>
        <div className="precos-grid">
          <div className="preco-item">
            <span className="preco-label">Primeira Hora</span>
            <span className="preco-valor">R$ {estacionamento.precos.primeiraHora.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="preco-item">
            <span className="preco-label">Demais Horas</span>
            <span className="preco-valor">R$ {estacionamento.precos.demaisHoras.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="preco-item">
            <span className="preco-label">Diária</span>
            <span className="preco-valor">R$ {estacionamento.precos.diaria.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="preco-item">
            <span className="preco-label">Mensalista</span>
            <span className="preco-valor">R$ {estacionamento.precos.mensalista.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
        
        <div className="formas-pagamento">
          <h4>
            <MdPayment className="icon" />
            Formas de Pagamento
          </h4>
          <div className="pagamento-chips">
            {estacionamento.formasPagamento.map((forma, index) => (
              <span key={index} className="pagamento-chip">{forma}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Avaliação e Opinião */}
      <div className="secao avaliacoes">
        <h3>
          <MdStar className="icon" />
          Avaliações dos Clientes
        </h3>
        <div className="avaliacao-resumo">
          <div className="nota-media">
            <span className="nota">{estacionamento.notaMedia}</span>
            <div className="estrelas">
              {renderStars(Math.round(estacionamento.notaMedia))}
            </div>
            <span className="total-avaliacoes">({estacionamento.totalAvaliacoes} avaliações)</span>
          </div>
        </div>
        
        <div className="lista-avaliacoes">
          {avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="avaliacao-item">
              <div className="avaliacao-header">
                <span className="usuario">{avaliacao.usuario}</span>
                <div className="avaliacao-nota">
                  {renderStars(avaliacao.nota)}
                </div>
                <span className="data">{new Date(avaliacao.data).toLocaleDateString('pt-BR')}</span>
              </div>
              <p className="comentario">{avaliacao.comentario}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Recursos Adicionais */}
      <div className="secao recursos">
        <h3>Recursos e Serviços</h3>
        <div className="recursos-grid">
          {estacionamento.recursos.map((recurso, index) => (
            <div 
              key={index} 
              className={`recurso-item ${recurso.disponivel ? 'disponivel' : 'indisponivel'}`}
            >
              {getRecursoIcon(recurso.icone)}
              <span>{recurso.nome}</span>
              {!recurso.disponivel && <span className="indisponivel-tag">Não disponível</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 6. Mapa Interativo */}
      <div className="secao mapa">
        <h3>
          <MdMap className="icon" />
          Localização
        </h3>
        <div className="mapa-container">
          <div className="mapa-placeholder">
            <MdLocationOn className="mapa-icon" />
            <p>Mapa Interativo</p>
            <small>Latitude: {estacionamento.latitude}, Longitude: {estacionamento.longitude}</small>
          </div>
        </div>
      </div>

      {/* Ações Principais */}
      <div className="acoes-principais">
        <button className="btn-reservar" onClick={handleReservar}>
          <MdSchedule />
          Reservar Agora
        </button>
        
        <div className="acoes-secundarias">
          <button className="btn-ligar" onClick={handleLigar}>
            <MdPhone />
            Ligar
          </button>
          <button className="btn-rota" onClick={handleRota}>
            <MdMap />
            Rota
          </button>
          <button className="btn-avaliar">
            <MdRateReview />
            Avaliar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DetalhesEstacionamento