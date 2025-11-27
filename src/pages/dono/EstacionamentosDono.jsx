import React, { useEffect, useState, useCallback } from 'react';
import { estacionamentoService } from '../../utils/services';
import { Toast, Modal, ModalBody, ModalFooter, ModalActions, Button, PageHeader } from '../../components/shared';
import api from '../../utils/api';
import { 
  MdLocationOn, 
  MdSchedule, 
  MdLocalParking, 
  MdStar,
  MdPeople,
  MdTrendingUp,
  MdAccessTime,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdSave,
  MdImage,
  MdRefresh
} from 'react-icons/md';

const EstacionamentosDono = () => {
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEstacionamento, setEditingEstacionamento] = useState(null);
  const [donoId, setDonoId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    CEP: '',
    numero: '',
    foto: '',
    numeroAlvaraDeFuncionamento: '',
    horaFechamento: '',
    horaAbertura: '',
    vagasPreferenciais: 0,
    maximoDeVagas: 0,
    numeroDeEscrituraImovel: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const data = await estacionamentoService.getAll();
      const lista = Array.isArray(data) ? data : (data.content || []);
      setEstacionamentos(lista);
      
      // Buscar donoId do usuário logado
      if (!donoId) {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const decoded = JSON.parse(jsonPayload);
            const email = decoded.sub;
            
            // Buscar dono por email
            const todosDonos = await api.get('/dono');
            const listaDonos = Array.isArray(todosDonos) ? todosDonos : (todosDonos.content || []);
            const dono = listaDonos.find(d => d.email === email);
            
            if (dono) {
              setDonoId(dono.id);
              console.log('DonoId encontrado:', dono.id);
            } else {
              console.error('Dono não encontrado com email:', email);
              setError('Não foi possível identificar o proprietário. Verifique suas permissões.');
            }
          }
        } catch (e) {
          console.error('Erro ao buscar donoId:', e);
          // Se der erro, tentar extrair dos estacionamentos como fallback
          if (lista.length > 0 && lista[0].dono) {
            const idDono = lista[0].dono.id || lista[0].dono;
            setDonoId(idDono);
            console.log('DonoId extraído dos estacionamentos:', idDono);
          }
        }
      }
      
      if (isRefresh) {
        setToast({ message: 'Dados atualizados com sucesso', type: 'success' });
      }
    } catch (e) {
      setError(e.message || 'Erro ao carregar estacionamentos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [donoId]);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);
    
    // Listener para atualizar quando reservas forem modificadas
    const handleReservaUpdate = () => {
      fetchData(true);
    };
    
    window.addEventListener('reservaUpdated', handleReservaUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('reservaUpdated', handleReservaUpdate);
    };
  }, [fetchData]);

  const handleManualRefresh = () => {
    fetchData(true);
  };

  // Calcula estatísticas de um estacionamento
  const calcularEstatisticas = (est) => {
    const reservas = est.reservas || [];
    const avaliacoes = est.avaliacoes || [];
    const acessos = est.acessos || [];
    const gerentes = est.gerentes || [];
    
    // Vagas disponíveis
    const vagasOcupadas = acessos.filter(a => !a.horaDeSaida).length;
    const vagasDisponiveis = est.maximoDeVagas - vagasOcupadas;
    const ocupacaoPercentual = est.maximoDeVagas > 0 
      ? ((vagasOcupadas / est.maximoDeVagas) * 100).toFixed(0) 
      : 0;
    
    // Média de avaliações
    const mediaAvaliacoes = avaliacoes.length > 0
      ? (avaliacoes.reduce((sum, av) => sum + (av.nota || 0), 0) / avaliacoes.length).toFixed(1)
      : 0;
    
    // Reservas pendentes
    const reservasPendentes = reservas.filter(r => 
      (r.statusReserva || r.status) === 'PENDENTE'
    ).length;
    
    return {
      vagasDisponiveis,
      vagasOcupadas,
      ocupacaoPercentual,
      mediaAvaliacoes,
      totalAvaliacoes: avaliacoes.length,
      reservasPendentes,
      totalGerentes: gerentes.length
    };
  };

  // Determina cor do indicador de ocupação
  const getOcupacaoColor = (percentual) => {
    if (percentual >= 90) return '#ef4444'; // Vermelho
    if (percentual >= 70) return '#f59e0b'; // Amarelo
    return '#10b981'; // Verde
  };

  const formatTime = (time) => {
    if (!time) return '--:--';
    return time.substring(0, 5);
  };

  const handleOpenModal = (estacionamento = null) => {
    if (estacionamento) {
      setEditingEstacionamento(estacionamento);
      setFormData({
        nome: estacionamento.nome || '',
        endereco: estacionamento.endereco || '',
        CEP: estacionamento.CEP || '',
        numero: estacionamento.numero || '',
        foto: estacionamento.foto || '',
        numeroAlvaraDeFuncionamento: estacionamento.numeroAlvaraDeFuncionamento || '',
        horaFechamento: estacionamento.horaFechamento || '',
        horaAbertura: estacionamento.horaAbertura || '',
        vagasPreferenciais: estacionamento.vagasPreferenciais || 0,
        maximoDeVagas: estacionamento.maximoDeVagas || 0,
        numeroDeEscrituraImovel: estacionamento.numeroDeEscrituraImovel || ''
      });
    } else {
      setEditingEstacionamento(null);
      setFormData({
        nome: '',
        endereco: '',
        CEP: '',
        numero: '',
        foto: '',
        numeroAlvaraDeFuncionamento: '',
        horaFechamento: '',
        horaAbertura: '',
        vagasPreferenciais: 0,
        maximoDeVagas: 0,
        numeroDeEscrituraImovel: ''
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEstacionamento(null);
    setFormData({
      nome: '',
      endereco: '',
      CEP: '',
      numero: '',
      foto: '',
      numeroAlvaraDeFuncionamento: '',
      horaFechamento: '',
      horaAbertura: '',
      vagasPreferenciais: 0,
      maximoDeVagas: 0,
      numeroDeEscrituraImovel: ''
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    // Nome - VARCHAR(255) NOT NULL
    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    } else if (formData.nome.length > 255) {
      errors.nome = 'Nome deve ter no máximo 255 caracteres';
    }

    // Endereço - VARCHAR(255) NOT NULL
    if (!formData.endereco.trim()) {
      errors.endereco = 'Endereço é obrigatório';
    } else if (formData.endereco.length > 255) {
      errors.endereco = 'Endereço deve ter no máximo 255 caracteres';
    }

    // CEP - VARCHAR(20)
    if (!formData.CEP.trim()) {
      errors.CEP = 'CEP é obrigatório';
    } else if (formData.CEP.replace(/\D/g, '').length !== 8) {
      errors.CEP = 'CEP deve ter 8 dígitos';
    } else if (formData.CEP.length > 20) {
      errors.CEP = 'CEP inválido';
    }

    // Número - VARCHAR(20)
    if (!formData.numero.trim()) {
      errors.numero = 'Número é obrigatório';
    } else if (formData.numero.length > 20) {
      errors.numero = 'Número deve ter no máximo 20 caracteres';
    }

    // Foto URL - VARCHAR(500)
    if (formData.foto && formData.foto.length > 500) {
      errors.foto = 'URL da foto deve ter no máximo 500 caracteres';
    }

    // Número Alvará - VARCHAR(100) NOT NULL
    if (!formData.numeroAlvaraDeFuncionamento.trim()) {
      errors.numeroAlvaraDeFuncionamento = 'Alvará é obrigatório';
    } else if (formData.numeroAlvaraDeFuncionamento.length > 100) {
      errors.numeroAlvaraDeFuncionamento = 'Número do alvará deve ter no máximo 100 caracteres';
    }

    // Número Escritura - VARCHAR(100)
    if (!formData.numeroDeEscrituraImovel.trim()) {
      errors.numeroDeEscrituraImovel = 'Escritura é obrigatória';
    } else if (formData.numeroDeEscrituraImovel.length > 100) {
      errors.numeroDeEscrituraImovel = 'Número da escritura deve ter no máximo 100 caracteres';
    }

    // Horário Abertura - TIME NOT NULL
    if (!formData.horaAbertura) {
      errors.horaAbertura = 'Horário de abertura é obrigatório';
    }

    // Horário Fechamento - TIME NOT NULL
    if (!formData.horaFechamento) {
      errors.horaFechamento = 'Horário de fechamento é obrigatório';
    }

    // Validar se horário de fechamento é posterior ao de abertura
    if (formData.horaAbertura && formData.horaFechamento) {
      const abertura = formData.horaAbertura.substring(0, 5);
      const fechamento = formData.horaFechamento.substring(0, 5);
      if (abertura >= fechamento) {
        errors.horaFechamento = 'Horário de fechamento deve ser posterior ao de abertura';
      }
    }

    // Máximo de Vagas - INT NOT NULL
    if (!formData.maximoDeVagas || formData.maximoDeVagas <= 0) {
      errors.maximoDeVagas = 'Deve ter pelo menos 1 vaga';
    } else if (!Number.isInteger(formData.maximoDeVagas)) {
      errors.maximoDeVagas = 'Deve ser um número inteiro';
    } else if (formData.maximoDeVagas > 2147483647) {
      errors.maximoDeVagas = 'Valor muito alto';
    }

    // Vagas Preferenciais - INT
    if (formData.vagasPreferenciais < 0) {
      errors.vagasPreferenciais = 'Não pode ser negativo';
    } else if (!Number.isInteger(formData.vagasPreferenciais)) {
      errors.vagasPreferenciais = 'Deve ser um número inteiro';
    } else if (formData.vagasPreferenciais > formData.maximoDeVagas) {
      errors.vagasPreferenciais = 'Não pode ser maior que o total de vagas';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToast({ message: 'Por favor, corrija os erros no formulário', type: 'error' });
      return;
    }

    if (!donoId && !editingEstacionamento) {
      setToast({ message: 'Erro: Dono não identificado', type: 'error' });
      return;
    }

    setSubmitting(true);

    try {
      if (editingEstacionamento) {
        // Atualizar
        const updated = await estacionamentoService.update(editingEstacionamento.id, formData);
        setEstacionamentos(prev => prev.map(est => 
          est.id === editingEstacionamento.id ? updated : est
        ));
        setToast({ message: 'Estacionamento atualizado com sucesso!', type: 'success' });
      } else {
        // Criar novo
        const created = await estacionamentoService.create(donoId, formData);
        setEstacionamentos(prev => [...prev, created]);
        setToast({ message: 'Estacionamento criado com sucesso!', type: 'success' });
      }
      
      handleCloseModal();
      fetchData(); // Recarregar lista
    } catch (err) {
      console.error('Erro ao salvar estacionamento:', err);
      setToast({ message: err.message || 'Erro ao salvar estacionamento', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (estacionamento) => {
    if (!window.confirm(`Tem certeza que deseja desativar "${estacionamento.nome}"?\n\nEsta ação irá marcar o estacionamento como inativo.`)) {
      return;
    }

    setSubmitting(true);
    try {
      await estacionamentoService.delete(estacionamento.id);
      setToast({ message: 'Estacionamento desativado com sucesso!', type: 'success' });
      fetchData(); // Recarregar lista
    } catch (err) {
      console.error('Erro ao desativar estacionamento:', err);
      setToast({ message: err.message || 'Erro ao desativar estacionamento', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo ao digitar
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCEP = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) return cleaned;
    return cleaned.substring(0, 5) + '-' + cleaned.substring(5, 8);
  };

  const handleCEPChange = (value) => {
    const formatted = formatCEP(value);
    handleInputChange('CEP', formatted);
  };

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <PageHeader
        title="Produtos"
        subtitle="Gerencie seus estacionamentos, visualize estatísticas e acompanhe reservas"
        actions={
          <div style={{ display: 'flex', gap: '.75rem' }}>
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.5rem',
                padding: '.75rem 1.25rem',
                background: refreshing ? '#e5e7eb' : '#ffffff',
                color: refreshing ? '#9ca3af' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '.875rem',
                fontWeight: '600',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <MdRefresh size={20} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </button>
            
            <button
              onClick={() => handleOpenModal()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.5rem',
                padding: '.75rem 1.5rem',
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <MdAdd size={20} />
              Novo Estacionamento
            </button>
          </div>
        }
      />
      
      <div style={{ padding: '0 2rem 2rem 2rem' }}>

      {error && (
        <div style={{ 
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

      {estacionamentos.length === 0 && !error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          background: '#ffffff', 
          borderRadius: '12px',
          border: '2px dashed #e5e7eb'
        }}>
          <MdLocalParking size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <h3 style={{ margin: '0 0 .5rem 0', color: '#374151' }}>Nenhum estacionamento cadastrado</h3>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '.875rem' }}>
            Cadastre seu primeiro estacionamento para começar
          </p>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gap: '1.5rem', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))' 
      }}>
        {estacionamentos.map(est => {
          const stats = calcularEstatisticas(est);
          const ocupacaoColor = getOcupacaoColor(stats.ocupacaoPercentual);

          return (
            <div 
              key={est.id} 
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.background = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              {/* Header com status */}
              <div style={{ 
                padding: '1.25rem',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 .5rem 0', 
                      fontSize: '1.125rem', 
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {est.nome}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: '#6b7280', fontSize: '.875rem' }}>
                      <MdLocationOn size={16} />
                      <span>{est.endereco}, {est.numero}</span>
                    </div>
                    <div style={{ marginTop: '.25rem', fontSize: '.75rem', color: '#9ca3af' }}>
                      CEP: {est.CEP}
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '.375rem .75rem',
                    borderRadius: '9999px',
                    background: est.status ? '#d1fae5' : '#fee2e2',
                    color: est.status ? '#065f46' : '#991b1b',
                    fontSize: '.75rem',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}>
                    {est.status ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
              </div>

              {/* Ocupação e Horário */}
              <div style={{ padding: '1.25rem', borderBottom: '1px solid #f3f4f6' }}>
                {/* Barra de ocupação */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                    <span style={{ fontSize: '.875rem', fontWeight: '600', color: '#374151' }}>
                      Ocupação
                    </span>
                    <span style={{ fontSize: '.875rem', fontWeight: '700', color: ocupacaoColor }}>
                      {stats.ocupacaoPercentual}%
                    </span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    background: '#e5e7eb', 
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${stats.ocupacaoPercentual}%`, 
                      height: '100%', 
                      background: ocupacaoColor,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '.5rem',
                    fontSize: '.75rem',
                    color: '#6b7280'
                  }}>
                    <span>Livres: {stats.vagasDisponiveis}</span>
                    <span>Ocupadas: {stats.vagasOcupadas}</span>
                    <span>Total: {est.maximoDeVagas}</span>
                  </div>
                </div>

                {/* Horário de funcionamento */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '.5rem',
                  padding: '.75rem',
                  background: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <MdSchedule size={18} style={{ color: '#6b7280' }} />
                  <span style={{ fontSize: '.875rem', color: '#374151' }}>
                    {formatTime(est.horaAbertura)} - {formatTime(est.horaFechamento)}
                  </span>
                </div>
              </div>

              {/* Estatísticas em grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                padding: '1.25rem'
              }}>
                {/* Avaliações */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '.25rem',
                    marginBottom: '.25rem'
                  }}>
                    <MdStar size={20} style={{ color: '#f59e0b' }} />
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                      {stats.mediaAvaliacoes}
                    </span>
                  </div>
                  <div style={{ fontSize: '.75rem', color: '#6b7280' }}>
                    {stats.totalAvaliacoes} avaliações
                  </div>
                </div>

                {/* Reservas Pendentes */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '.25rem',
                    marginBottom: '.25rem'
                  }}>
                    <MdAccessTime size={20} style={{ color: '#3b82f6' }} />
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                      {stats.reservasPendentes}
                    </span>
                  </div>
                  <div style={{ fontSize: '.75rem', color: '#6b7280' }}>
                    Pendentes
                  </div>
                </div>

                {/* Gerentes */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '.25rem',
                    marginBottom: '.25rem'
                  }}>
                    <MdPeople size={20} style={{ color: '#8b5cf6' }} />
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                      {stats.totalGerentes}
                    </span>
                  </div>
                  <div style={{ fontSize: '.75rem', color: '#6b7280' }}>
                    Gerentes
                  </div>
                </div>
              </div>

              {/* Footer com ações e vagas preferenciais */}
              <div style={{ 
                padding: '1rem 1.25rem',
                background: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '.75rem', color: '#6b7280' }}>
                  <span style={{ fontWeight: '600' }}>Vagas Preferenciais:</span> {est.vagasPreferenciais}
                </div>
                
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(est);
                    }}
                    style={{
                      padding: '.5rem .75rem',
                      background: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '.375rem'
                    }}
                    title="Editar"
                  >
                    <MdEdit size={14} />
                    Editar
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(est);
                    }}
                    disabled={submitting}
                    style={{
                      padding: '.5rem .75rem',
                      background: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '.75rem',
                      fontWeight: '600',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '.375rem'
                    }}
                    title="Desativar"
                  >
                    <MdDelete size={14} />
                    Desativar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Criar/Editar Estacionamento */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingEstacionamento ? 'Editar Estacionamento' : 'Novo Estacionamento'}
          size="lg"
        >
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {/* Nome */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.875rem', fontWeight: '500', color: '#374151' }}>
                    Nome do Estacionamento *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Ex: Estacionamento Centro"
                    maxLength={255}
                    style={{
                      width: '100%',
                      padding: '.625rem',
                      border: formErrors.nome ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '.875rem'
                    }}
                  />
                  {formErrors.nome && <span style={{ fontSize: '.75rem', color: '#ef4444', display: 'block', marginTop: '.25rem' }}>{formErrors.nome}</span>}
                  <small style={{ fontSize: '.75rem', color: '#6b7280', display: 'block', marginTop: '.25rem' }}>
                    {formData.nome.length}/255 caracteres
                  </small>
                </div>

                {/* Endereço */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.875rem', fontWeight: '500', color: '#374151' }}>
                    Endereço *
                  </label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange('endereco', e.target.value)}
                    placeholder="Ex: Rua das Flores"
                    maxLength={255}
                    style={{
                      width: '100%',
                      padding: '.625rem',
                      border: formErrors.endereco ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '.875rem'
                    }}
                  />
                  {formErrors.endereco && <span style={{ fontSize: '.75rem', color: '#ef4444', display: 'block', marginTop: '.25rem' }}>{formErrors.endereco}</span>}
                  <small style={{ fontSize: '.75rem', color: '#6b7280', display: 'block', marginTop: '.25rem' }}>
                    {formData.endereco.length}/255 caracteres
                  </small>
                </div>

                {/* Número */}
                <div>
                  <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.875rem', fontWeight: '500', color: '#374151' }}>
                    Número *
                  </label>
                  <input
                    type="text"
                    value={formData.numero}
                    onChange={(e) => handleInputChange('numero', e.target.value)}
                    placeholder="Ex: 123"
                    maxLength={20}
                    style={{
                      width: '100%',
                      padding: '.625rem',
                      border: formErrors.numero ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '.875rem'
                    }}
                  />
                  {formErrors.numero && <span style={{ fontSize: '.75rem', color: '#ef4444', display: 'block', marginTop: '.25rem' }}>{formErrors.numero}</span>}
                </div>

                {/* CEP */}
                <div>
                  <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.875rem', fontWeight: '500', color: '#374151' }}>
                    CEP *
                  </label>
                  <input
                    type="text"
                    value={formData.CEP}
                    onChange={(e) => handleCEPChange(e.target.value)}
                    placeholder="00000-000"
                    maxLength="9"
                    style={{
                      width: '100%',
                      padding: '.625rem',
                      border: formErrors.CEP ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '.875rem'
                    }}
                  />
                  {formErrors.CEP && <span style={{ fontSize: '.75rem', color: '#ef4444', display: 'block', marginTop: '.25rem' }}>{formErrors.CEP}</span>}
                  <small style={{ fontSize: '.75rem', color: '#6b7280', display: 'block', marginTop: '.25rem' }}>
                    Formato: 00000-000
                  </small>
                </div>

                {/* Hora Abertura */}
                <div>
                  <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.875rem', fontWeight: '500', color: '#374151' }}>
                    Horário de Abertura *
                  </label>
                  <input
                    type="time"
                    value={formData.horaAbertura}
                    onChange={(e) => handleInputChange('horaAbertura', e.target.value + ':00')}
                    style={{
                      width: '100%',
                      padding: '.625rem',
                      border: formErrors.horaAbertura ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '.875rem'
                    }}
                  />
                  {formErrors.horaAbertura && <span style={{ fontSize: '.75rem', color: '#ef4444' }}>{formErrors.horaAbertura}</span>}
                </div>

                {/* Hora Fechamento */}
                <div>
                  <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.875rem', fontWeight: '500', color: '#374151' }}>
                    Horário de Fechamento *
                  </label>
                  <input
                    type="time"
                    value={formData.horaFechamento}
                    onChange={(e) => handleInputChange('horaFechamento', e.target.value + ':00')}
                    style={{
                      width: '100%',
                      padding: '.625rem',
                      border: formErrors.horaFechamento ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '.875rem'
                    }}
                  />
                  {formErrors.horaFechamento && <span style={{ fontSize: '.75rem', color: '#ef4444' }}>{formErrors.horaFechamento}</span>}
                </div>

                {/* Máximo de Vagas */}
                <div>
                  <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.875rem', fontWeight: '500', color: '#374151' }}>
                    Total de Vagas *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="2147483647"
                    value={formData.maximoDeVagas}
                    onChange={(e) => handleInputChange('maximoDeVagas', parseInt(e.target.value) || 0)}
                    placeholder="Ex: 50"
                    style={{
                      width: '100%',
                      padding: '.625rem',
                      border: formErrors.maximoDeVagas ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '.875rem'
                    }}
                  />
                  {formErrors.maximoDeVagas && <span style={{ fontSize: '.75rem', color: '#ef4444', display: 'block', marginTop: '.25rem' }}>{formErrors.maximoDeVagas}</span>}
                  <small style={{ fontSize: '.75rem', color: '#6b7280', display: 'block', marginTop: '.25rem' }}>
                    Número inteiro positivo
                  </small>
                </div>

                {/* Vagas Preferenciais */}
                <div>
                  <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.875rem', fontWeight: '500', color: '#374151' }}>
                    Vagas Preferenciais *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formData.maximoDeVagas}
                    value={formData.vagasPreferenciais}
                    onChange={(e) => handleInputChange('vagasPreferenciais', parseInt(e.target.value) || 0)}
                    placeholder="Ex: 5"
                    style={{
                      width: '100%',
                      padding: '.625rem',
                      border: formErrors.vagasPreferenciais ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '.875rem'
                    }}
                  />
                  {formErrors.vagasPreferenciais && <span style={{ fontSize: '.75rem', color: '#ef4444', display: 'block', marginTop: '.25rem' }}>{formErrors.vagasPreferenciais}</span>}
                  <small style={{ fontSize: '.75rem', color: '#6b7280', display: 'block', marginTop: '.25rem' }}>
                    Máximo: {formData.maximoDeVagas} (total de vagas)
                  </small>
                </div>

                {/* Alvará */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.875rem', fontWeight: '500', color: '#374151' }}>
                    Número do Alvará de Funcionamento *
                  </label>
                  <input
                    type="text"
                    value={formData.numeroAlvaraDeFuncionamento}
                    onChange={(e) => handleInputChange('numeroAlvaraDeFuncionamento', e.target.value)}
                    placeholder="Ex: ALV-2024-00123"
                    maxLength={100}
                    style={{
                      width: '100%',
                      padding: '.625rem',
                      border: formErrors.numeroAlvaraDeFuncionamento ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '.875rem'
                    }}
                  />
                  {formErrors.numeroAlvaraDeFuncionamento && <span style={{ fontSize: '.75rem', color: '#ef4444', display: 'block', marginTop: '.25rem' }}>{formErrors.numeroAlvaraDeFuncionamento}</span>}
                  <small style={{ fontSize: '.75rem', color: '#6b7280', display: 'block', marginTop: '.25rem' }}>
                    {formData.numeroAlvaraDeFuncionamento.length}/100 caracteres
                  </small>
                </div>

                {/* Escritura */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.875rem', fontWeight: '500', color: '#374151' }}>
                    Número de Escritura do Imóvel *
                  </label>
                  <input
                    type="text"
                    value={formData.numeroDeEscrituraImovel}
                    onChange={(e) => handleInputChange('numeroDeEscrituraImovel', e.target.value)}
                    placeholder="Ex: ESC-2024-00456"
                    maxLength={100}
                    style={{
                      width: '100%',
                      padding: '.625rem',
                      border: formErrors.numeroDeEscrituraImovel ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '.875rem'
                    }}
                  />
                  {formErrors.numeroDeEscrituraImovel && <span style={{ fontSize: '.75rem', color: '#ef4444', display: 'block', marginTop: '.25rem' }}>{formErrors.numeroDeEscrituraImovel}</span>}
                  <small style={{ fontSize: '.75rem', color: '#6b7280', display: 'block', marginTop: '.25rem' }}>
                    {formData.numeroDeEscrituraImovel.length}/100 caracteres
                  </small>
                </div>

                {/* Foto URL */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '.5rem', fontSize: '.875rem', fontWeight: '500', color: '#374151' }}>
                    URL da Foto (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.foto}
                    onChange={(e) => handleInputChange('foto', e.target.value)}
                    placeholder="https://exemplo.com/foto.jpg"
                    maxLength={500}
                    style={{
                      width: '100%',
                      padding: '.625rem',
                      border: formErrors.foto ? '1px solid #ef4444' : '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '.875rem'
                    }}
                  />
                  {formErrors.foto && <span style={{ fontSize: '.75rem', color: '#ef4444', display: 'block', marginTop: '.25rem' }}>{formErrors.foto}</span>}
                  <small style={{ fontSize: '.75rem', color: '#6b7280', display: 'block', marginTop: '.25rem' }}>
                    Cole o link de uma imagem online ({formData.foto.length}/500 caracteres)
                  </small>
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <ModalActions>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                >
                  {submitting ? 'Salvando...' : (editingEstacionamento ? 'Atualizar' : 'Criar Estacionamento')}
                </Button>
              </ModalActions>
            </ModalFooter>
          </form>
        </Modal>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      </div>
    </div>
  );
};

export default EstacionamentosDono;
