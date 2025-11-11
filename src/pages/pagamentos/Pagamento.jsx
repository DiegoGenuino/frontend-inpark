import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, getAuthHeaders } from '../../utils/auth'
import { 
  MdLocationOn, 
  MdCalendarToday, 
  MdAccessTime, 
  MdAttachMoney,
  MdChevronLeft,
  MdCreditCard,
  MdPix,
  MdSecurity,
  MdContentCopy,
  MdCheck,
  MdError,
  MdInfo
} from 'react-icons/md'
import './Pagamento.css'

const Pagamento = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [processandoPagamento, setProcessandoPagamento] = useState(false)
  
  // Dados da reserva (vindos da criação de reserva)
  const [dadosReserva, setDadosReserva] = useState(state?.reserva || null)
  
  // Método de pagamento selecionado
  const [metodoPagamento, setMetodoPagamento] = useState('')
  
  // Dados do cartão
  const [dadosCartao, setDadosCartao] = useState({
    numero: '',
    nome: '',
    validadeMes: '',
    validadeAno: '',
    cvv: '',
    cpf: '',
    salvarCartao: false
  })
  
  // Dados do PIX (simulados)
  const [dadosPix, setDadosPix] = useState(null)
  const [pixCopiado, setPixCopiado] = useState(false)

  useEffect(() => {
    // Se não há dados da reserva, redirecionar
    if (!dadosReserva) {
      navigate('/estacionamentos')
      return
    }

    // Gerar dados do PIX quando necessário
    if (metodoPagamento === 'pix' && !dadosPix) {
      gerarDadosPix()
    }
  }, [metodoPagamento, dadosReserva, navigate])

  const gerarDadosPix = () => {
    // Simular geração de código PIX
    const codigoPix = `00020126580014BR.GOV.BCB.PIX01364d7f8e5c-9a3b-4f2e-8d1c-${Date.now()}5204000053039865802BR5925INPARK ESTACIONAMENTOS6009SAO PAULO62070503***6304`
    const chaveAleatoria = Math.random().toString(36).substring(2, 15)
    
    setDadosPix({
      codigo: codigoPix,
      chave: `pix@inpark.com.br`,
      valor: dadosReserva.valorTotal,
      vencimento: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
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

  const formatarNumeroCartao = (valor) => {
    // Remove tudo que não é número
    const numero = valor.replace(/\D/g, '')
    // Aplica máscara xxxx xxxx xxxx xxxx
    return numero.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  const formatarCPF = (valor) => {
    // Remove tudo que não é número
    const cpf = valor.replace(/\D/g, '')
    // Aplica máscara xxx.xxx.xxx-xx
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const validarFormularioCartao = () => {
    const erros = []
    
    if (!dadosCartao.numero || dadosCartao.numero.replace(/\s/g, '').length !== 16) {
      erros.push('Número do cartão deve ter 16 dígitos')
    }
    
    if (!dadosCartao.nome || dadosCartao.nome.trim().length < 2) {
      erros.push('Nome do titular é obrigatório')
    }
    
    if (!dadosCartao.validadeMes || !dadosCartao.validadeAno) {
      erros.push('Data de validade é obrigatória')
    }
    
    if (!dadosCartao.cvv || dadosCartao.cvv.length < 3) {
      erros.push('CVV deve ter pelo menos 3 dígitos')
    }
    
    if (!dadosCartao.cpf || dadosCartao.cpf.replace(/\D/g, '').length !== 11) {
      erros.push('CPF deve ter 11 dígitos')
    }

    return erros
  }

  const copiarCodigoPix = async () => {
    try {
      await navigator.clipboard.writeText(dadosPix.codigo)
      setPixCopiado(true)
      setTimeout(() => setPixCopiado(false), 3000)
    } catch (err) {
      console.error('Erro ao copiar código PIX:', err)
    }
  }

  const handleVoltar = () => {
    navigate(-1)
  }

  const handleFinalizarPagamento = async () => {
    setError(null)
    
    // Validações básicas
    if (!metodoPagamento) {
      setError('Selecione um método de pagamento')
      return
    }

    setProcessandoPagamento(true)
    
    try {
      // ⚠️ PAGAMENTO SIMULADO - Não envia dados reais
      // Simular processamento do pagamento (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Sucesso garantido (pagamento simulado)
      navigate('/pagamento/confirmacao', {
        state: {
          reserva: dadosReserva,
          metodoPagamento,
          transacaoId: `TXN${Date.now()}`,
          valorPago: dadosReserva.valorTotal,
          simulado: true
        }
      })
      
    } catch (err) {
      setError('Erro ao processar pagamento simulado')
    } finally {
      setProcessandoPagamento(false)
    }
  }

  const handleInputChange = (field, value) => {
    setDadosCartao(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!dadosReserva) {
    return (
      <div className="pagamento-page">
        <div className="loading-container">
          <p>Redirecionando...</p>
        </div>
      </div>
    )
  }

  const inicio = formatDateTime(dadosReserva.dataInicio)
  const fim = formatDateTime(dadosReserva.dataFim)

  return (
    <div className="pagamento-page">
      {/* Header */}
      <div className="pagamento-header">
        <button className="btn-voltar" onClick={handleVoltar}>
          <MdChevronLeft />
          Voltar
        </button>
        <h1>Finalizar Pagamento</h1>
      </div>

      {/* Aviso de pagamento simulado */}
      <div className="info-message" style={{ 
        background: '#e0f2fe', 
        border: '1px solid #0ea5e9', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '.5rem'
      }}>
        <MdInfo style={{ color: '#0ea5e9', fontSize: '24px' }} />
        <div>
          <strong style={{ color: '#0369a1' }}>Modo de Demonstração</strong>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#075985' }}>
            Este é um pagamento simulado. Nenhum valor real será cobrado.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <MdError className="icon" />
          {error}
        </div>
      )}

      <div className="pagamento-container">
        <div className="pagamento-content">
          {/* 1. Resumo da Transação */}
          <section className="secao resumo-transacao">
            <h2>Resumo da Transação</h2>
            <div className="resumo-content">
              <div className="resumo-item">
                <div className="resumo-info">
                  <MdLocationOn className="info-icon" />
                  <div>
                    <p className="info-label">Estacionamento</p>
                    <p className="info-valor">{dadosReserva.estacionamento.nome}</p>
                    <p className="info-endereco">{dadosReserva.estacionamento.endereco}</p>
                  </div>
                </div>
              </div>

              <div className="resumo-item">
                <div className="resumo-info">
                  <MdCalendarToday className="info-icon" />
                  <div>
                    <p className="info-label">Período da Reserva</p>
                    <p className="info-valor">
                      <strong>Início:</strong> {inicio.date} às {inicio.time}
                    </p>
                    <p className="info-valor">
                      <strong>Fim:</strong> {fim.date} às {fim.time}
                    </p>
                  </div>
                </div>
              </div>

              <div className="resumo-item">
                <div className="resumo-info">
                  <MdAttachMoney className="info-icon" />
                  <div>
                    <p className="info-label">Veículo e Vaga</p>
                    <p className="info-valor">{dadosReserva.placaVeiculo} - Vaga {dadosReserva.tipoVaga}</p>
                  </div>
                </div>
              </div>

              <div className="resumo-total">
                <div className="total-line">
                  <span>Total a Pagar:</span>
                  <span className="valor-total">R$ {dadosReserva.valorTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Seleção do Método de Pagamento */}
          <section className="secao metodos-pagamento">
            <h2>Método de Pagamento</h2>
            <div className="metodos-grid">
              {/* PIX */}
              <div className={`metodo-card ${metodoPagamento === 'pix' ? 'selected' : ''}`} 
                   onClick={() => setMetodoPagamento('pix')}>
                <input 
                  type="radio" 
                  name="metodoPagamento" 
                  value="pix" 
                  checked={metodoPagamento === 'pix'}
                  onChange={() => setMetodoPagamento('pix')}
                />
                <div className="metodo-content">
                  <MdPix className="metodo-icon pix" />
                  <div className="metodo-info">
                    <h3>PIX</h3>
                    <p>Pagamento instantâneo</p>
                    <small>Aprovação imediata</small>
                  </div>
                </div>
              </div>

              {/* Cartão */}
              <div className={`metodo-card ${metodoPagamento === 'cartao' ? 'selected' : ''}`} 
                   onClick={() => setMetodoPagamento('cartao')}>
                <input 
                  type="radio" 
                  name="metodoPagamento" 
                  value="cartao" 
                  checked={metodoPagamento === 'cartao'}
                  onChange={() => setMetodoPagamento('cartao')}
                />
                <div className="metodo-content">
                  <MdCreditCard className="metodo-icon cartao" />
                  <div className="metodo-info">
                    <h3>Cartão de Crédito/Débito</h3>
                    <p>Visa, Mastercard, Elo</p>
                    <small>Processamento seguro</small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Formulário PIX */}
          {metodoPagamento === 'pix' && dadosPix && (
            <section className="secao pix-form">
              <h2>Pagamento via PIX</h2>
              <div className="pix-container">
                <div className="pix-qrcode">
                  <div className="qr-placeholder">
                    <MdPix size={80} />
                    <p>QR Code PIX</p>
                    <small>Escaneie com seu banco</small>
                  </div>
                </div>
                
                <div className="pix-details">
                  <div className="pix-info">
                    <h3>Informações do PIX</h3>
                    <div className="pix-item">
                      <span>Chave PIX:</span>
                      <span>{dadosPix.chave}</span>
                    </div>
                    <div className="pix-item">
                      <span>Valor:</span>
                      <span>R$ {dadosPix.valor.toFixed(2)}</span>
                    </div>
                    <div className="pix-item">
                      <span>Válido até:</span>
                      <span>{dadosPix.vencimento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  
                  <div className="pix-codigo">
                    <label>Código PIX Copia e Cola:</label>
                    <div className="codigo-container">
                      <textarea 
                        value={dadosPix.codigo} 
                        readOnly 
                        className="codigo-text"
                      />
                      <button 
                        className={`btn-copiar ${pixCopiado ? 'copiado' : ''}`}
                        onClick={copiarCodigoPix}
                      >
                        {pixCopiado ? <MdCheck /> : <MdContentCopy />}
                        {pixCopiado ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pix-instrucoes">
                <MdInfo className="icon" />
                <div>
                  <p><strong>Como pagar:</strong></p>
                  <ol>
                    <li>Abra o app do seu banco ou carteira digital</li>
                    <li>Escaneie o QR Code ou cole o código PIX</li>
                    <li>Confirme os dados e finalize o pagamento</li>
                    <li>O pagamento será processado automaticamente</li>
                  </ol>
                </div>
              </div>
            </section>
          )}

          {/* 3. Formulário do Cartão */}
          {metodoPagamento === 'cartao' && (
            <section className="secao cartao-form">
              <h2>Dados do Cartão</h2>
              <div className="cartao-container">
                <div className="form-grid">
                  <div className="campo">
                    <label>
                      <MdCreditCard className="icon" />
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      value={dadosCartao.numero}
                      onChange={(e) => handleInputChange('numero', formatarNumeroCartao(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      maxLength="19"
                      className="form-input"
                    />
                  </div>

                  <div className="campo">
                    <label>Nome Impresso no Cartão</label>
                    <input
                      type="text"
                      value={dadosCartao.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value.toUpperCase())}
                      placeholder="NOME COMPLETO"
                      className="form-input"
                    />
                  </div>

                  <div className="campo-grupo">
                    <div className="campo">
                      <label>Mês</label>
                      <select
                        value={dadosCartao.validadeMes}
                        onChange={(e) => handleInputChange('validadeMes', e.target.value)}
                        className="form-input"
                      >
                        <option value="">Mês</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="campo">
                      <label>Ano</label>
                      <select
                        value={dadosCartao.validadeAno}
                        onChange={(e) => handleInputChange('validadeAno', e.target.value)}
                        className="form-input"
                      >
                        <option value="">Ano</option>
                        {Array.from({ length: 10 }, (_, i) => (
                          <option key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                            {String(new Date().getFullYear() + i).slice(-2)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="campo">
                      <label>
                        <MdSecurity className="icon" />
                        CVV
                      </label>
                      <input
                        type="text"
                        value={dadosCartao.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                        placeholder="000"
                        maxLength="4"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="campo">
                    <label>CPF do Titular</label>
                    <input
                      type="text"
                      value={dadosCartao.cpf}
                      onChange={(e) => handleInputChange('cpf', formatarCPF(e.target.value))}
                      placeholder="000.000.000-00"
                      maxLength="14"
                      className="form-input"
                    />
                  </div>

                  <div className="campo-checkbox">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={dadosCartao.salvarCartao}
                        onChange={(e) => handleInputChange('salvarCartao', e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Salvar cartão para próximas compras
                    </label>
                    <small>Seus dados serão armazenados de forma segura</small>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar com resumo e ações */}
        <div className="pagamento-sidebar">
          <div className="resumo-pagamento">
            <h3>Resumo do Pagamento</h3>
            <div className="resumo-linha">
              <span>Subtotal:</span>
              <span>R$ {dadosReserva.valorTotal.toFixed(2)}</span>
            </div>
            <div className="resumo-linha">
              <span>Taxa de serviço:</span>
              <span>R$ 0,00</span>
            </div>
            <div className="resumo-divider"></div>
            <div className="resumo-linha total">
              <span>Total:</span>
              <span>R$ {dadosReserva.valorTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="acoes-pagamento">
            <button 
              className="btn-finalizar"
              onClick={handleFinalizarPagamento}
              disabled={!metodoPagamento || processandoPagamento}
            >
              {processandoPagamento ? (
                <>
                  <div className="loading-spinner-small" />
                  Processando...
                </>
              ) : (
                <>
                  <MdCheck />
                  Pagar R$ {dadosReserva.valorTotal.toFixed(2)}
                </>
              )}
            </button>

            <button className="btn-cancelar" onClick={handleVoltar}>
              Cancelar Transação
            </button>
          </div>

          <div className="seguranca-info">
            <MdSecurity className="icon" />
            <div>
              <p><strong>Pagamento Seguro</strong></p>
              <small>Seus dados são protegidos com criptografia SSL</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pagamento