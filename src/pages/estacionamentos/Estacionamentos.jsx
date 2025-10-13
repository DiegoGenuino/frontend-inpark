import React, { useEffect, useState } from 'react'
import { useAuth, getAuthHeaders } from '../../utils/auth'
import { useNavigate } from 'react-router-dom'
import { MdSearch, MdLocationOn, MdAccessTime, MdLocalParking, MdStar, MdClose, MdPhone, MdEmail, MdAttachMoney, MdSecurity, MdWifi, MdAccessibleForward, MdDirectionsCar, MdCalendarToday, MdPerson } from 'react-icons/md'
import { ParkingCard, Modal, ModalBody, ModalFooter, ModalActions, Button, Badge } from '../../components/shared'
import './Estacionamentos.css'

// Componente do Modal de Reserva
const ReservaModal = ({ estacionamento, onClose, isOpen }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    clienteId: user?.id || 1,
    estacioId: estacionamento.id,
    dataDaReserva: '',
    horaDaReserva: '',
    statusReserva: 'PENDENTE'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Data mínima é hoje
  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const API_BASE = import.meta.env.VITE_API_URL || ''
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }

      // Converter data para formato Date
      const reservaData = {
        ...formData,
        dataDaReserva: new Date(formData.dataDaReserva).toISOString(),
        horaDaReserva: formData.horaDaReserva + ':00' // Adicionar segundos se necessário
      }

      const response = await fetch(`${API_BASE}/reservas`, {
        method: 'POST',
        headers,
        body: JSON.stringify(reservaData)
      })

      if (response.ok) {
        alert('Reserva criada com sucesso!')
        onClose()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao criar reserva')
      }
    } catch (err) {
      console.error('Erro ao criar reserva:', err)
      setError(err.message || 'Erro ao criar reserva. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fazer Reserva"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="estacionamento-info" style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '6px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', fontSize: '1rem' }}>
              <MdLocationOn /> {estacionamento.nome}
            </h3>
            <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#6b7280' }}>{estacionamento.endereco}</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#6b7280' }}>CEP: {estacionamento.CEP}</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
              Horário: {estacionamento.horarioAbertura?.substring(0, 5)} - {estacionamento.horarioFechamento?.substring(0, 5)}
            </p>
          </div>

          {error && (
            <div className="error-message" style={{ 
              padding: '0.75rem', 
              background: '#fee2e2', 
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#dc2626',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="clienteId" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                <MdPerson /> Cliente ID
              </label>
              <input
                type="number"
                id="clienteId"
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                disabled
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  background: '#f9fafb'
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="estacioId" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                <MdLocalParking /> Estacionamento ID
              </label>
              <input
                type="number"
                id="estacioId"
                name="estacioId"
                value={formData.estacioId}
                onChange={handleChange}
                disabled
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  background: '#f9fafb'
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dataDaReserva" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                <MdCalendarToday /> Data da Reserva
              </label>
              <input
                type="date"
                id="dataDaReserva"
                name="dataDaReserva"
                value={formData.dataDaReserva}
                onChange={handleChange}
                min={today}
                required
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="horaDaReserva" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                <MdAccessTime /> Hora da Reserva
              </label>
              <input
                type="time"
                id="horaDaReserva"
                name="horaDaReserva"
                value={formData.horaDaReserva}
                onChange={handleChange}
                required
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              />
              <small className="form-hint" style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                Horário de funcionamento: {estacionamento.horarioAbertura?.substring(0, 5)} às {estacionamento.horarioFechamento?.substring(0, 5)}
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="statusReserva" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Status da Reserva
              </label>
              <select
                id="statusReserva"
                name="statusReserva"
                value={formData.statusReserva}
                onChange={handleChange}
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.875rem'
                }}
              >
                <option value="PENDENTE">Pendente</option>
                <option value="ATIVA">Ativa</option>
              </select>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <ModalActions>
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              variant="primary"
              loading={loading}
            >
              {loading ? 'Criando Reserva...' : 'Confirmar Reserva'}
            </Button>
          </ModalActions>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export const Estacionamentos = () => {
  const { role } = useAuth()
  const navigate = useNavigate()
  const [estacionamentos, setEstacionamentos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredEstacionamentos, setFilteredEstacionamentos] = useState([])
  const [selectedEstacionamento, setSelectedEstacionamento] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEstacionamentoReserva, setSelectedEstacionamentoReserva] = useState(null)
  const [isReservaModalOpen, setIsReservaModalOpen] = useState(false)

  const API_BASE = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    const fetchEstacionamentos = async () => {
      setLoading(true)
      setError(null)
      try {
        const headers = {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }

        const res = await fetch(`${API_BASE}/estacionamentos`, {
          method: 'GET',
          headers,
          signal: controller.signal
        })

        if (!res.ok) {
          throw new Error(`Erro na requisição: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()
        if (mounted) {
          const estacionamentosAtivos = Array.isArray(data) ? data.filter(est => est.status === true) : []
          setEstacionamentos(estacionamentosAtivos)
          setFilteredEstacionamentos(estacionamentosAtivos)
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Erro desconhecido')
          // Dados mock para demonstração
          const mockData = [
            {
              id: 1,
              nome: "Estacionamento Central",
              endereco: "Rua das Flores",
              CEP: "12345-678",
              numero: "123",
              horaAbertura: "08:00:00",
              horaFechamento: "22:00:00",
              vagasPreferenciais: 15,
              maximoDeVagas: 120,
              status: true
            },
            {
              id: 2,
              nome: "Shopping Park",
              endereco: "Av. Principal",
              CEP: "54321-987",
              numero: "456",
              horaAbertura: "06:00:00",
              horaFechamento: "24:00:00",
              vagasPreferenciais: 25,
              maximoDeVagas: 300,
              status: true
            },
            {
              id: 3,
              nome: "Estacionamento Norte",
              endereco: "Rua do Norte",
              CEP: "11111-222",
              numero: "789",
              horaAbertura: "07:00:00",
              horaFechamento: "21:00:00",
              vagasPreferenciais: 10,
              maximoDeVagas: 80,
              status: true
            }
          ]
          setEstacionamentos(mockData)
          setFilteredEstacionamentos(mockData)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchEstacionamentos()

    return () => {
      mounted = false
      controller.abort()
    }
  }, [API_BASE])

  // Filtrar estacionamentos baseado na busca
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEstacionamentos(estacionamentos)
    } else {
      const filtered = estacionamentos.filter(est =>
        est.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.CEP.includes(searchTerm)
      )
      setFilteredEstacionamentos(filtered)
    }
  }, [searchTerm, estacionamentos])

  // Funções do modal de detalhes
  const openModal = (estacionamento) => {
    setSelectedEstacionamento(estacionamento)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEstacionamento(null)
  }

  // Funções do modal de reserva
  const openReservaModal = (estacionamento) => {
    setSelectedEstacionamentoReserva(estacionamento)
    setIsReservaModalOpen(true)
  }

  const closeReservaModal = () => {
    setIsReservaModalOpen(false)
    setSelectedEstacionamentoReserva(null)
  }

  const formatTime = (timeString) => {
    if (!timeString) return '--:--'
    return timeString.substring(0, 5) // Remove os segundos
  }

  const calculateAvailableSpots = (total, preferencial) => {
    // Simular vagas ocupadas (entre 0 e total)
    const occupied = Math.floor(Math.random() * total)
    return total - occupied
  }

  return (
    <div className="estacionamentos-page">
      <div className="page-header">
        <h1>Estacionamentos</h1>
        <p>Encontre o melhor estacionamento para você</p>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <MdSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome, endereço ou CEP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="results-count">
          {filteredEstacionamentos.length} estacionamento(s) encontrado(s)
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando estacionamentos...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-container">
          <p>⚠️ Erro ao carregar: {error}</p>
          <p>Exibindo dados de demonstração</p>
        </div>
      )}

      {!loading && (
        <div className="estacionamentos-grid">
          {filteredEstacionamentos.length === 0 ? (
            <div className="no-results">
              <MdLocalParking size={64} color="#ccc" />
              <h3>Nenhum estacionamento encontrado</h3>
              <p>Tente ajustar os termos de busca</p>
            </div>
          ) : (
            filteredEstacionamentos.map((est) => (
              <ParkingCard
                key={est.id}
                parking={est}
                onReserve={openReservaModal}
                onViewDetails={(parking) => navigate(`/estacionamento/${parking.id}`)}
              />
            ))
          )}
        </div>
      )}

      {/* Modal de Detalhes */}
      {isModalOpen && selectedEstacionamento && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={selectedEstacionamento.nome}
          size="lg"
        >
          <ModalBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="modal-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 600 }}>
                  <MdLocationOn /> Localização
                </h3>
                <p className="modal-address" style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
                  {selectedEstacionamento.endereco}
                </p>
                <p className="modal-cep" style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#6b7280', fontFamily: 'monospace' }}>
                  CEP: {selectedEstacionamento.CEP}
                </p>
              </div>

              <div className="modal-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 600 }}>
                  <MdAccessTime /> Horário de Funcionamento
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', fontFamily: 'monospace' }}>
                  {formatTime(selectedEstacionamento.horarioAbertura)} - {formatTime(selectedEstacionamento.horarioFechamento)}
                </p>
              </div>

              <div className="modal-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 600 }}>
                  <MdDirectionsCar /> Informações de Vagas
                </h3>
                <div className="modal-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div className="stat-item" style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '6px' }}>
                    <span className="stat-number" style={{ display: 'block', fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>
                      {selectedEstacionamento.maximoDeVagas}
                    </span>
                    <span className="stat-label" style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Total de Vagas
                    </span>
                  </div>
                  <div className="stat-item" style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '6px' }}>
                    <span className="stat-number" style={{ display: 'block', fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>
                      {selectedEstacionamento.vagasOcupadas || Math.floor(selectedEstacionamento.maximoDeVagas * 0.6)}
                    </span>
                    <span className="stat-label" style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Vagas Ocupadas
                    </span>
                  </div>
                  <div className="stat-item" style={{ textAlign: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '6px' }}>
                    <span className="stat-number" style={{ display: 'block', fontSize: '1.5rem', fontWeight: 600, color: '#111827' }}>
                      {selectedEstacionamento.maximoDeVagas - (selectedEstacionamento.vagasOcupadas || Math.floor(selectedEstacionamento.maximoDeVagas * 0.6))}
                    </span>
                    <span className="stat-label" style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Vagas Livres
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 600 }}>
                  <MdAttachMoney /> Preços
                </h3>
                <div className="price-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>
                    <strong>Primeira hora:</strong> R$ 5,00
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>
                    <strong>Demais horas:</strong> R$ 3,00
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>
                    <strong>Diária:</strong> R$ 25,00
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>
                    <strong>Mensalista:</strong> R$ 180,00
                  </p>
                </div>
              </div>

              <div className="modal-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 600 }}>
                  <MdSecurity /> Facilidades
                </h3>
                <div className="facilities" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  <div className="facility-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '6px' }}>
                    <MdSecurity style={{ fontSize: '1.25rem', color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem' }}>Segurança 24h</span>
                  </div>
                  <div className="facility-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '6px' }}>
                    <MdWifi style={{ fontSize: '1.25rem', color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem' }}>Wi-Fi Gratuito</span>
                  </div>
                  <div className="facility-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '6px' }}>
                    <MdAccessibleForward style={{ fontSize: '1.25rem', color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem' }}>Acessibilidade</span>
                  </div>
                  <div className="facility-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '6px' }}>
                    <MdLocalParking style={{ fontSize: '1.25rem', color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem' }}>Valet</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 600 }}>
                  <MdPhone /> Contato
                </h3>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0', fontSize: '0.875rem' }}>
                  <MdPhone /> (11) 9999-9999
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0', fontSize: '0.875rem' }}>
                  <MdEmail /> contato@{selectedEstacionamento.nome.toLowerCase().replace(/\s+/g, '')}.com
                </p>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <ModalActions>
              <Button variant="outline" onClick={closeModal}>
                Fechar
              </Button>
              <Button variant="primary" onClick={() => {
                closeModal();
                openReservaModal(selectedEstacionamento);
              }}>
                Reservar Vaga
              </Button>
            </ModalActions>
          </ModalFooter>
        </Modal>
      )}

      {/* Modal de Fazer Reserva */}
      {isReservaModalOpen && selectedEstacionamentoReserva && (
        <ReservaModal 
          estacionamento={selectedEstacionamentoReserva}
          onClose={closeReservaModal}
          isOpen={isReservaModalOpen}
        />
      )}
    </div>
  )
}

export default Estacionamentos
