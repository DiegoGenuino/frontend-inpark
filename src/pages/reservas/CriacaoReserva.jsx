import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../utils/auth'
import api from '../../utils/api'
import { usuarioService } from '../../utils/services'
import { 
  MdLocationOn, 
  MdCalendarToday, 
  MdAccessTime, 
  MdDirectionsCar,
  MdLocalParking,
  MdAttachMoney,
  MdChevronLeft,
  MdSchedule,
  MdInfo,
  MdCheck
} from 'react-icons/md'
import { Toast } from '../../components/shared'
import './CriacaoReserva.css'

const CriacaoReserva = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  
  // Dados do estacionamento (vem da navegação ou busca por ID)
  const [estacionamento, setEstacionamento] = useState(state?.estacionamento || null)
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    dataInicio: '',
    horaInicio: '',
    duracaoHoras: 1,
    duracao: '1h',
    veiculoSelecionado: '',
    tipoVaga: 'comum'
  })
  
  // Dados auxiliares
  const [veiculos, setVeiculos] = useState([])
  const [precos, setPrecos] = useState({
    subtotal: 0,
    taxaServico: 2.50,
    total: 0
  })

  // Opções de duração
  const opcoesDuracao = [
    { value: '1h', label: '1 hora', horas: 1 },
    { value: '2h', label: '2 horas', horas: 2 },
    { value: '3h', label: '3 horas', horas: 3 },
    { value: '4h', label: '4 horas', horas: 4 },
    { value: '6h', label: '6 horas', horas: 6 },
    { value: '8h', label: '8 horas', horas: 8 },
    { value: '12h', label: '12 horas', horas: 12 },
    { value: '1d', label: '1 dia (24h)', horas: 24 },
    { value: '2d', label: '2 dias', horas: 48 },
    { value: '3d', label: '3 dias', horas: 72 }
  ]

  useEffect(() => {
    if (!estacionamento) {
      navigate('/estacionamentos')
      return
    }
    
    fetchVeiculos()
    setDataMinimaHoje()
  }, [])

  useEffect(() => {
    calcularPrecos()
  }, [formData.duracaoHoras, formData.tipoVaga])

  const fetchVeiculos = async () => {
    try {
      // Buscar dados do usuário logado
      const userData = await usuarioService.getMe();
      
      if (!userData || !userData.id) {
        throw new Error('Usuário não encontrado');
      }

      // Buscar carros do cliente usando o endpoint correto
      const carros = await api.get('/carro');
      
      // Filtrar apenas os carros do cliente logado
      const carrosDoCliente = Array.isArray(carros) 
        ? carros.filter(carro => carro.clienteId === userData.id || carro.cliente?.id === userData.id)
        : [];
      
      console.log('Carros do cliente:', carrosDoCliente);
      
      setVeiculos(carrosDoCliente);
      
      if (carrosDoCliente.length > 0) {
        setFormData(prev => ({ ...prev, veiculoSelecionado: carrosDoCliente[0].id }));
      }
    } catch (err) {
      console.error('Erro ao carregar veículos:', err);
      setVeiculos([]);
      setToast({ message: 'Erro ao carregar seus veículos. Por favor, cadastre um veículo antes de fazer uma reserva.', type: 'error' });
    }
  }

  const setDataMinimaHoje = () => {
    const hoje = new Date()
    const dataMinima = hoje.toISOString().split('T')[0]
    setFormData(prev => ({ ...prev, dataInicio: dataMinima }))
  }

  const calcularPrecos = () => {
    if (!estacionamento) return

    const { duracaoHoras, tipoVaga } = formData
    let subtotal = 0

    // Lógica de preços baseada na duração
    if (duracaoHoras <= 1) {
      subtotal = estacionamento.precos?.primeiraHora || 6.00
    } else if (duracaoHoras >= 24) {
      const dias = Math.ceil(duracaoHoras / 24)
      subtotal = (estacionamento.precos?.diaria || 35.00) * dias
    } else {
      const primeiraHora = estacionamento.precos?.primeiraHora || 6.00
      const demaisHoras = (duracaoHoras - 1) * (estacionamento.precos?.demaisHoras || 4.00)
      subtotal = primeiraHora + demaisHoras
    }

    // Acréscimo para vaga preferencial
    if (tipoVaga === 'preferencial') {
      subtotal *= 1.2 // 20% a mais
    }

    const taxaServico = 2.50
    const total = subtotal + taxaServico

    setPrecos({
      subtotal: subtotal,
      taxaServico: taxaServico,
      total: total
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Limpar erro do campo ao digitar
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }))
    }

    if (name === 'duracao') {
      const opcaoSelecionada = opcoesDuracao.find(opcao => opcao.value === value)
      setFormData(prev => ({
        ...prev,
        duracao: value,
        duracaoHoras: opcaoSelecionada?.horas || 1
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validarFormulario = () => {
    const { dataInicio, horaInicio, veiculoSelecionado } = formData
    const newErrors = {}
    let isValid = true
    
    if (!dataInicio) {
      newErrors.dataInicio = 'Data é obrigatória'
      isValid = false
    }
    
    if (!horaInicio) {
      newErrors.horaInicio = 'Hora é obrigatória'
      isValid = false
    }
    
    if (!veiculoSelecionado) {
      newErrors.veiculoSelecionado = 'Selecione um veículo'
      isValid = false
    }

    if (!isValid) {
      setFieldErrors(newErrors)
      setToast({ message: 'Por favor, preencha todos os campos obrigatórios.', type: 'error' })
      return false
    }

    // Validar se a data/hora não é no passado
    const agora = new Date()
    const dataHoraReserva = new Date(`${dataInicio}T${horaInicio}`)
    
    if (dataHoraReserva <= agora) {
      setToast({ message: 'A data e hora da reserva deve ser no futuro.', type: 'error' })
      return false
    }

    // Validar horário de funcionamento
    if (estacionamento.horarioAbertura && estacionamento.horarioFechamento) {
      const horaReserva = parseInt(horaInicio.split(':')[0])
      const horaAbertura = parseInt(estacionamento.horarioAbertura.split(':')[0])
      const horaFechamento = parseInt(estacionamento.horarioFechamento.split(':')[0])
      
      if (horaReserva < horaAbertura || horaReserva >= horaFechamento) {
        setToast({ message: `O horário deve estar entre ${estacionamento.horarioAbertura.substring(0, 5)} e ${estacionamento.horarioFechamento.substring(0, 5)}.`, type: 'error' })
        return false
      }
    }

    return true
  }

  const calcularDataFim = () => {
    const dataInicio = new Date(formData.dataInicio + 'T' + formData.horaInicio + ':00')
    const dataFim = new Date(dataInicio.getTime() + (formData.duracaoHoras * 60 * 60 * 1000))
    return dataFim.toISOString()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setToast(null)

    if (!validarFormulario()) {
      return
    }

    setLoading(true)

    try {
      // 1. Buscar clienteId do backend
      const userData = await usuarioService.getMe();
      
      if (!userData || !userData.id) {
        throw new Error('Usuário não encontrado. Faça login novamente.');
      }

      // 2. Buscar placa do veículo selecionado
      const veiculoSelecionado = veiculos.find(v => v.id === formData.veiculoSelecionado);
      
      if (!veiculoSelecionado) {
        throw new Error('Veículo não encontrado. Por favor, selecione um veículo válido.');
      }

      // 3. Preparar dados da reserva com clienteId (número) e placa
      const reservaData = {
        clienteId: userData.id,
        estacioId: estacionamento.id,
        dataDaReserva: formData.dataInicio, // Formato: "2023-12-25"
        horaDaReserva: formData.horaInicio + ':00', // Formato: "14:30:00"
        placaVeiculo: veiculoSelecionado.placa, // Placa do veículo
        tipoVaga: formData.tipoVaga, // Tipo de vaga (comum ou preferencial)
        valorTotal: precos.total, // Valor total calculado
        statusReserva: 'PENDENTE'
      }

      console.log('Enviando reserva:', reservaData);

      // 4. Fazer POST para criar a reserva
      const reservaCriada = await api.post('/reserva', reservaData);
      
      console.log('Reserva criada:', reservaCriada);

      // 5. Preparar dados para o pagamento (reutilizar veiculoSelecionado já buscado)
      const dadosReserva = {
        id: reservaCriada.id,
        dataInicio: formData.dataInicio + 'T' + formData.horaInicio + ':00.000Z',
        dataFim: calcularDataFim(),
        placaVeiculo: veiculoSelecionado.placa,
        tipoVaga: formData.tipoVaga,
        valorTotal: precos.total,
        estacionamento: {
          id: estacionamento.id,
          nome: estacionamento.nome,
          endereco: estacionamento.endereco
        }
      }
      
      // 6. Navegar para a página de pagamento
      navigate('/pagamento', { 
        state: { reserva: dadosReserva } 
      })

    } catch (err) {
      console.error('Erro ao criar reserva:', err)
      setToast({ message: err.message || 'Erro ao criar reserva. Tente novamente.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const veiculoSelecionado = veiculos.find(v => v.id.toString() === formData.veiculoSelecionado.toString())
  const podeUsarPreferencial = veiculoSelecionado?.tipo === 'preferencial'

  if (!estacionamento) {
    return (
      <div className="criacao-reserva-loading">
        <p>Carregando dados do estacionamento...</p>
      </div>
    )
  }

  return (
    <div className="criacao-reserva">
      {/* Header */}
      <div className="reserva-header">
        <button onClick={() => navigate(-1)} className="btn-voltar">
          <MdChevronLeft />
          Voltar
        </button>
        <h1>Criar Reserva</h1>
      </div>

      <div className="reserva-container">
        {/* Confirmação do Estacionamento */}
        <div className="secao estacionamento-confirmacao">
          <h2>Estacionamento Selecionado</h2>
          <div className="estacionamento-info">
            <div className="estacionamento-detalhes">
              <h3>{estacionamento.nome}</h3>
              <div className="endereco">
                <MdLocationOn className="icon" />
                <span>{estacionamento.endereco}</span>
              </div>
              {estacionamento.distancia && (
                <div className="distancia">
                  <span>{estacionamento.distancia} de você</span>
                </div>
              )}
            </div>
            <div className="estacionamento-preco">
              <span className="preco-label">A partir de</span>
              <span className="preco-valor">
                R$ {estacionamento.precos?.primeiraHora?.toFixed(2).replace('.', ',') || '6,00'}/h
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="reserva-form">
          {/* Campos do Formulário */}
          <div className="secao formulario-campos">
            <h2>Detalhes da Reserva</h2>
            
            <div className="campos-grid">
              {/* Data de Início */}
              <div className="campo">
                <label htmlFor="dataInicio">
                  <MdCalendarToday className="icon" />
                  Data de Início *
                </label>
                <input
                  type="date"
                  id="dataInicio"
                  name="dataInicio"
                  value={formData.dataInicio}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className={`form-input ${fieldErrors.dataInicio ? 'error' : ''}`}
                />
                {fieldErrors.dataInicio && <span className="field-error-text">{fieldErrors.dataInicio}</span>}
              </div>

              {/* Hora de Início */}
              <div className="campo">
                <label htmlFor="horaInicio">
                  <MdAccessTime className="icon" />
                  Hora de Início *
                </label>
                <input
                  type="time"
                  id="horaInicio"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleInputChange}
                  required
                  className={`form-input ${fieldErrors.horaInicio ? 'error' : ''}`}
                />
                {fieldErrors.horaInicio && <span className="field-error-text">{fieldErrors.horaInicio}</span>}
                <small className="campo-hint">
                  Funcionamento: {estacionamento.horarioAbertura?.substring(0, 5)} às {estacionamento.horarioFechamento?.substring(0, 5)}
                </small>
              </div>

              {/* Duração Estimada */}
              <div className="campo duracao">
                <label htmlFor="duracao">
                  <MdSchedule className="icon" />
                  Duração Estimada *
                </label>
                <select
                  id="duracao"
                  name="duracao"
                  value={formData.duracao}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  {opcoesDuracao.map((opcao) => (
                    <option key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Veículo Selecionado */}
              <div className="campo veiculo">
                <label htmlFor="veiculoSelecionado">
                  <MdDirectionsCar className="icon" />
                  Veículo *
                </label>
                <select
                  id="veiculoSelecionado"
                  name="veiculoSelecionado"
                  value={formData.veiculoSelecionado}
                  onChange={handleInputChange}
                  required
                  className={`form-input ${fieldErrors.veiculoSelecionado ? 'error' : ''}`}
                >
                  <option value="">Selecione um veículo</option>
                  {veiculos.map((veiculo) => (
                    <option key={veiculo.id} value={veiculo.id}>
                      {veiculo.placa} - {veiculo.modelo} ({veiculo.cor})
                    </option>
                  ))}
                </select>
                {fieldErrors.veiculoSelecionado && <span className="field-error-text">{fieldErrors.veiculoSelecionado}</span>}
                {veiculos.length === 0 && (
                  <small className="campo-hint warning">
                    Você precisa cadastrar um veículo para continuar.
                  </small>
                )}
              </div>

              {/* Tipo de Vaga */}
              <div className="campo tipo-vaga">
                <label>
                  <MdLocalParking className="icon" />
                  Tipo de Vaga *
                </label>
                <div className="radio-group">
                  <div className="radio-item">
                    <input
                      type="radio"
                      id="vaga-comum"
                      name="tipoVaga"
                      value="comum"
                      checked={formData.tipoVaga === 'comum'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="vaga-comum">
                      <span className="radio-custom"></span>
                      Vaga Comum
                      <small>Preço padrão</small>
                    </label>
                  </div>
                  <div className={`radio-item ${!podeUsarPreferencial ? 'disabled' : ''}`}>
                    <input
                      type="radio"
                      id="vaga-preferencial"
                      name="tipoVaga"
                      value="preferencial"
                      checked={formData.tipoVaga === 'preferencial'}
                      onChange={handleInputChange}
                      disabled={!podeUsarPreferencial}
                    />
                    <label htmlFor="vaga-preferencial">
                      <span className="radio-custom"></span>
                      Vaga Preferencial
                      <small>+20% sobre o preço padrão</small>
                    </label>
                  </div>
                </div>
                {!podeUsarPreferencial && (
                  <small className="campo-hint">
                    Disponível apenas para veículos adaptados ou autorizados
                  </small>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Resumo do Pedido */}
        <div className="secao resumo-pedido">
          <h2>Resumo do Pedido</h2>
          <div className="resumo-content">
            <div className="resumo-item">
              <span className="item-label">Estacionamento ({formData.duracao})</span>
              <span className="item-valor">R$ {precos.subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="resumo-item taxa">
              <span className="item-label">Taxa de serviço</span>
              <span className="item-valor">R$ {precos.taxaServico.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="resumo-divider"></div>
            <div className="resumo-item total">
              <span className="item-label">Total a Pagar</span>
              <span className="item-valor">R$ {precos.total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="reserva-acoes">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-cancelar"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || veiculos.length === 0}
            className="btn-confirmar"
          >
            {loading ? (
              <>
                <div className="loading-spinner-small"></div>
                Processando...
              </>
            ) : (
              <>
                <MdCheck />
                Pagar e Confirmar Reserva
              </>
            )}
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
  )
}

export default CriacaoReserva