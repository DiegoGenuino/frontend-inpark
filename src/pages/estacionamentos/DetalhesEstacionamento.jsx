import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getAuthHeaders } from '../../utils/auth'
import { 
  MdLocationOn, 
  MdAccessTime, 
  MdDirectionsCar,
  MdMap,
  MdSchedule,
  MdChevronLeft
} from 'react-icons/md'
import './DetalhesEstacionamento.css'

const DetalhesEstacionamento = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [estacionamento, setEstacionamento] = useState(location.state?.estacionamento || null)
  const [loading, setLoading] = useState(!location.state?.estacionamento)
  const [error, setError] = useState(null)

  const API_BASE = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    // Se já tem o estacionamento (veio via state), não precisa buscar
    if (estacionamento) {
      console.log('Estacionamento já carregado via state:', estacionamento)
      return
    }
    
    // Se não tem, busca do backend
    fetchEstacionamentoDetalhes()
  }, [id, estacionamento])

  const fetchEstacionamentoDetalhes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }

      console.log('Buscando detalhes do estacionamento:', id)
      console.log('URL:', `${API_BASE}/estacionamento/${id}`)

      const response = await fetch(`${API_BASE}/estacionamento/${id}`, {
        method: 'GET',
        headers
      })

      console.log('Status da resposta:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Dados recebidos:', data)
        setEstacionamento(data)
        setError(null)
      } else {
        const errorText = await response.text()
        console.error('Erro na resposta:', response.status, errorText)
        throw new Error(`Erro ${response.status}: ${errorText}`)
      }
    } catch (err) {
<<<<<<< HEAD
      console.error('Erro ao carregar detalhes:', err)
      setError(err.message || 'Não foi possível carregar os detalhes do estacionamento')
=======
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
>>>>>>> 3ae40fcecaddc02821302fc421579390c69c4339
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
    
    if (estacionamento?.horaAbertura && estacionamento?.horaFechamento) {
      const [abreHora, abreMinuto] = estacionamento.horaAbertura.split(':').map(Number)
      const [fechaHora, fechaMinuto] = estacionamento.horaFechamento.split(':').map(Number)
      
      const abreMinutos = abreHora * 60 + abreMinuto
      const fechaMinutos = fechaHora * 60 + fechaMinuto
      
      return currentTime >= abreMinutos && currentTime <= fechaMinutos
    }
    return true
  }

  const handleReservar = () => {
    // Redirecionar para tela de reserva com dados do estacionamento
    navigate(`/estacionamento/${id}/reservar`, { 
      state: { estacionamento } 
    })
  }

  const handleRota = () => {
    if (estacionamento?.endereco) {
      const enderecoCompleto = `${estacionamento.endereco}, ${estacionamento.numero} - CEP ${estacionamento.CEP}`
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`
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
        <p>{error || 'O estacionamento solicitado não foi encontrado ou não está disponível.'}</p>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
          ID buscado: {id}
        </p>
        <button onClick={() => navigate('/estacionamentos')} className="btn-voltar">
          Voltar para Estacionamentos
        </button>
      </div>
    )
  }

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
              <p className="endereco-principal">{estacionamento.endereco}, {estacionamento.numero}</p>
              <p className="endereco-complemento">CEP: {estacionamento.CEP}</p>
            </div>
          </div>
        </div>
        
        {/* Documentação */}
        <div className="documentacao-info">
          <div className="doc-item">
            <strong>Alvará de Funcionamento:</strong>
            <span>{estacionamento.numeroAlvaraDeFuncionamento}</span>
          </div>
          <div className="doc-item">
            <strong>Escritura do Imóvel:</strong>
            <span>{estacionamento.numeroDeEscrituraImovel}</span>
          </div>
        </div>
      </div>

      {/* 2. Mídia e Horário */}
      <div className="secao midia-horario">
        {estacionamento.foto && (
          <div className="galeria">
            <h3>Foto do Local</h3>
            <div className="galeria-container">
              <img 
                src={estacionamento.foto} 
                alt={`Foto do ${estacionamento.nome}`}
                className="galeria-imagem"
              />
            </div>
          </div>
        )}

        <div className="horario-funcionamento">
          <h3>
            <MdAccessTime className="icon" />
            Horário de Funcionamento
          </h3>
          <div className="horario-info">
            <span className="horario">
              {formatTime(estacionamento.horaAbertura)} - {formatTime(estacionamento.horaFechamento)}
            </span>
            <span className={`status ${isAberto() ? 'aberto' : 'fechado'}`}>
              {isAberto() ? '🟢 Aberto agora' : '🔴 Fechado agora'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Vagas */}
      <div className="secao vagas-tempo-real">
        <h3>
          <MdDirectionsCar className="icon" />
          Capacidade de Vagas
        </h3>
        <div className="vagas-grid">
          <div className="vaga-tipo">
            <div className="vaga-numero">
              <span className="numero">{estacionamento.maximoDeVagas}</span>
            </div>
            <span className="vaga-label">Total de Vagas</span>
          </div>
          
          <div className="vaga-tipo preferencial">
            <div className="vaga-numero">
              <span className="numero">{estacionamento.vagasPreferenciais}</span>
            </div>
            <span className="vaga-label">Vagas Preferenciais</span>
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
          <button className="btn-rota" onClick={handleRota}>
            <MdMap />
            Como Chegar
          </button>
        </div>
      </div>
    </div>
  )
}

export default DetalhesEstacionamento