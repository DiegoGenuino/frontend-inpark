import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  MdCheckCircle, 
  MdLocationOn, 
  MdCalendarToday, 
  MdDirectionsCar,
  MdAttachMoney,
  MdReceipt,
  MdHome,
  MdQrCode,
  MdPrint
} from 'react-icons/md'
import './ConfirmacaoPagamento.css'

const ConfirmacaoPagamento = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  
  const { reserva, metodoPagamento, transacaoId, valorPago } = state || {}

  useEffect(() => {
    // Se não há dados da transação, redirecionar
    if (!reserva || !transacaoId) {
      navigate('/estacionamentos')
      return
    }
  }, [reserva, transacaoId, navigate])

  const formatDateTime = (dateString) => {
    if (!dateString) {
      return { date: 'Não definido', time: '--:--' }
    }
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return { date: 'Data inválida', time: '--:--' }
    }
    return {
      date: date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const handleIrParaHome = () => {
    navigate('/')
  }

  const handleVerMinhasReservas = () => {
    navigate('/minhas-reservas')
  }

  const handleGerarQRCode = () => {
    alert('QR Code para entrada será exibido aqui')
  }

  const handleImprimirComprovante = () => {
    window.print()
  }

  if (!reserva) {
    return null;
  }

  // Lidar com diferentes formatos de data do backend
  const dataInicio = reserva.dataInicio || 
    (reserva.dataDaReserva && reserva.horaDaReserva ? 
      `${reserva.dataDaReserva}T${reserva.horaDaReserva}` : null)
  
  const dataFim = reserva.dataFim || dataInicio
  
  const inicio = formatDateTime(dataInicio)
  const fim = formatDateTime(dataFim)
  
  // Lidar com diferentes formatos de placa
  const placaVeiculo = reserva.placaVeiculo || 
    reserva.veiculo?.placa || 
    reserva.carro?.placa || 
    'Não informado'
  
  // Lidar com diferentes formatos de tipo de vaga
  const tipoVaga = reserva.tipoVaga || 
    reserva.tipo || 
    'Normal'

  return (
    <div className="confirmacao-page">
      <div className="confirmacao-container">
        {/* Header de Sucesso */}
        <div className="sucesso-header">
          <div className="sucesso-icon">
            <MdCheckCircle />
          </div>
          <h1>Pagamento Confirmado!</h1>
          <p>Sua reserva foi criada com sucesso</p>
        </div>

        {/* Informações da Transação */}
        <div className="transacao-info">
          <div className="transacao-header">
            <h2>Comprovante de Pagamento</h2>
            <button className="btn-imprimir" onClick={handleImprimirComprovante}>
              <MdPrint />
              Imprimir
            </button>
          </div>

          <div className="transacao-detalhes">
            <div className="detalhe-linha">
              <span className="label">Número da Transação:</span>
              <span className="valor">{transacaoId}</span>
            </div>
            <div className="detalhe-linha">
              <span className="label">Data do Pagamento:</span>
              <span className="valor">{new Date().toLocaleString('pt-BR')}</span>
            </div>
            <div className="detalhe-linha">
              <span className="label">Método de Pagamento:</span>
              <span className="valor">
                {metodoPagamento === 'pix' ? 'PIX' : 'Cartão de Crédito/Débito'}
              </span>
            </div>
            <div className="detalhe-linha">
              <span className="label">Valor Pago:</span>
              <span className="valor destaque">R$ {valorPago.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Detalhes da Reserva */}
        <div className="reserva-confirmada">
          <h2>Detalhes da Reserva</h2>
          <div className="reserva-card-confirmacao">
            <div className="reserva-codigo">
              <span className="codigo-label">Código da Reserva</span>
              <span className="codigo-valor">#RES{String(reserva.id || 1).padStart(4, '0')}</span>
            </div>

            <div className="reserva-detalhes-grid">
              <div className="detalhe-item">
                <div className="detalhe-header">
                  <MdLocationOn className="icon" />
                  <span className="title">Estacionamento</span>
                </div>
                <div className="detalhe-content">
                  <p className="nome">{reserva.estacionamento.nome}</p>
                  <p className="endereco">{reserva.estacionamento.endereco}</p>
                </div>
              </div>

              <div className="detalhe-item">
                <div className="detalhe-header">
                  <MdCalendarToday className="icon" />
                  <span className="title">Período</span>
                </div>
                <div className="detalhe-content">
                  <p><strong>Início:</strong> {inicio.date} às {inicio.time}</p>
                  <p><strong>Fim:</strong> {fim.date} às {fim.time}</p>
                </div>
              </div>

              <div className="detalhe-item">
                <div className="detalhe-header">
                  <MdDirectionsCar className="icon" />
                  <span className="title">Veículo</span>
                </div>
                <div className="detalhe-content">
                  <p className="placa">{placaVeiculo}</p>
                  <p className="tipo">Vaga {tipoVaga}</p>
                </div>
              </div>

              <div className="detalhe-item">
                <div className="detalhe-header">
                  <MdAttachMoney className="icon" />
                  <span className="title">Valor</span>
                </div>
                <div className="detalhe-content">
                  <p className="valor-final">R$ {(reserva.valorTotal || reserva.valor || 0).toFixed(2)}</p>
                  <p className="status-pagamento">✓ Pago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="proximos-passos">
          <h2>Próximos Passos</h2>
          <div className="passos-lista">
            <div className="passo">
              <div className="passo-numero">1</div>
              <div className="passo-content">
                <h3>Guarde seu comprovante</h3>
                <p>Imprima ou salve este comprovante para apresentar se necessário</p>
              </div>
            </div>

            <div className="passo">
              <div className="passo-numero">2</div>
              <div className="passo-content">
                <h3>Gere seu QR Code de entrada</h3>
                <p>Use o QR Code para acessar o estacionamento no dia da reserva</p>
              </div>
            </div>

            <div className="passo">
              <div className="passo-numero">3</div>
              <div className="passo-content">
                <h3>Chegue no horário</h3>
                <p>Apresente-se no estacionamento no horário agendado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="acoes-confirmacao">
          <button className="btn-qrcode" onClick={handleGerarQRCode}>
            <MdQrCode />
            Gerar QR Code de Entrada
          </button>
          
          <button className="btn-minhas-reservas" onClick={handleVerMinhasReservas}>
            <MdReceipt />
            Ver Minhas Reservas
          </button>
          
          <button className="btn-home" onClick={handleIrParaHome}>
            <MdHome />
            Voltar ao Início
          </button>
        </div>

        {/* Informações de Contato */}
        <div className="info-contato">
          <h3>Precisa de ajuda?</h3>
          <p>Entre em contato conosco:</p>
          <div className="contato-opcoes">
            <span>📞 (11) 4444-5555</span>
            <span>✉️ suporte@inpark.com.br</span>
            <span>💬 Chat online</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmacaoPagamento