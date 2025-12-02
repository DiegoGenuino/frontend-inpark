import React, { useEffect, useState, useCallback } from 'react';
import { estacionamentoService } from '../../utils/services';
import { Toast, Header, FormWizard } from '../../components/shared';
import api from '../../utils/api';
import { 
  MdLocationOn, 
  MdSchedule, 
  MdLocalParking, 
  MdStar,
  MdPeople,
  MdAccessTime,
  MdAdd,
  MdEdit,
  MdDelete,
  MdRefresh
} from 'react-icons/md';
import './EstacionamentosDono.css';

const EstacionamentosDono = () => {
  const [estacionamentos, setEstacionamentos] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setToast(null);
    try {
      const data = await estacionamentoService.getAll();
      const lista = Array.isArray(data) ? data : (data.content || []);
      setEstacionamentos(lista);
      
      // Buscar donoId do usuário logado
      if (!donoId) {
        try {
          // Usar rota /auth/me do backend para buscar dados do usuário logado
          const userData = await api.post('/auth/me');
          
          if (userData && userData.id) {
            setDonoId(userData.id);
            console.log('DonoId encontrado via /auth/me:', userData.id);
          } else {
            console.error('Dados do usuário não retornaram ID');
            setToast({ message: 'Não foi possível identificar o proprietário. Verifique suas permissões.', type: 'error' });
          }
        } catch (e) {
          console.error('Erro ao buscar dados do usuário:', e);
          // Se der erro, tentar extrair dos estacionamentos como fallback
          if (lista.length > 0 && lista[0].dono) {
            const idDono = lista[0].dono.id || lista[0].dono;
            setDonoId(idDono);
            console.log('DonoId extraído dos estacionamentos (fallback):', idDono);
          }
        }
      }
      
      if (isRefresh) {
        setToast({ message: 'Dados atualizados com sucesso', type: 'success' });
      }
    } catch (e) {
      setToast({ message: e.message || 'Erro ao carregar estacionamentos', type: 'error' });
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
  };

  // Wizard Steps Components
  const Step1BasicInfo = ({ data, updateData }) => {
    const [localErrors, setLocalErrors] = useState({});

    const validateField = (field, value) => {
      let error = '';
      if (field === 'nome') {
        if (!value.trim()) error = 'Nome é obrigatório';
        else if (value.length > 255) error = 'Nome muito longo';
      }
      if (field === 'foto') {
        if (value && value.length > 500) error = 'URL muito longa';
      }

      setLocalErrors(prev => ({ ...prev, [field]: error }));
      if (error) {
        setToast({ message: error, type: 'error' });
      }
      return !error;
    };

    const handleChange = (field, value) => {
      updateData({ [field]: value });
      if (localErrors[field]) setLocalErrors(prev => ({ ...prev, [field]: '' }));
    };

    return (
      <div>
        <div className="wizard-form-group">
          <label className="wizard-label">Nome do Estacionamento *</label>
          <input
            type="text"
            value={data.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            onBlur={(e) => validateField('nome', e.target.value)}
            placeholder="Ex: Estacionamento Centro"
            maxLength={255}
            className={`wizard-input ${localErrors.nome ? 'error' : ''}`}
          />
          {localErrors.nome && <div className="wizard-error-text">{localErrors.nome}</div>}
          <div className="wizard-hint">{data.nome.length}/255 caracteres</div>
        </div>

        <div className="wizard-form-group">
          <label className="wizard-label">URL da Foto (Opcional)</label>
          <input
            type="text"
            value={data.foto}
            onChange={(e) => handleChange('foto', e.target.value)}
            onBlur={(e) => validateField('foto', e.target.value)}
            placeholder="https://exemplo.com/foto.jpg"
            maxLength={500}
            className={`wizard-input ${localErrors.foto ? 'error' : ''}`}
          />
          {localErrors.foto && <div className="wizard-error-text">{localErrors.foto}</div>}
          <div className="wizard-hint">Cole o link de uma imagem online ({data.foto.length}/500 caracteres)</div>
        </div>
      </div>
    );
  };

  const Step2Location = ({ data, updateData }) => {
    const [localErrors, setLocalErrors] = useState({});

    const formatCEP = (value) => {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 5) return cleaned;
      return cleaned.substring(0, 5) + '-' + cleaned.substring(5, 8);
    };

    const validateField = (field, value) => {
      let error = '';
      if (field === 'CEP') {
        if (!value.trim()) error = 'CEP é obrigatório';
        else if (value.replace(/\D/g, '').length !== 8) error = 'CEP inválido';
      }
      if (field === 'endereco') {
        if (!value.trim()) error = 'Endereço é obrigatório';
      }
      if (field === 'numero') {
        if (!value.trim()) error = 'Número é obrigatório';
      }

      setLocalErrors(prev => ({ ...prev, [field]: error }));
      if (error) {
        setToast({ message: error, type: 'error' });
      }
      return !error;
    };

    const handleCEPChange = (e) => {
      const formatted = formatCEP(e.target.value);
      updateData({ CEP: formatted });
      if (localErrors.CEP) setLocalErrors(prev => ({ ...prev, CEP: '' }));
    };

    const handleChange = (field, value) => {
      updateData({ [field]: value });
      if (localErrors[field]) setLocalErrors(prev => ({ ...prev, [field]: '' }));
    };

    return (
      <div>
        <div className="wizard-form-group">
          <label className="wizard-label">CEP *</label>
          <input
            type="text"
            value={data.CEP}
            onChange={handleCEPChange}
            onBlur={(e) => validateField('CEP', e.target.value)}
            placeholder="00000-000"
            maxLength="9"
            className={`wizard-input ${localErrors.CEP ? 'error' : ''}`}
          />
          {localErrors.CEP && <div className="wizard-error-text">{localErrors.CEP}</div>}
        </div>

        <div className="wizard-form-group">
          <label className="wizard-label">Endereço *</label>
          <input
            type="text"
            value={data.endereco}
            onChange={(e) => handleChange('endereco', e.target.value)}
            onBlur={(e) => validateField('endereco', e.target.value)}
            placeholder="Ex: Rua das Flores"
            maxLength={255}
            className={`wizard-input ${localErrors.endereco ? 'error' : ''}`}
          />
          {localErrors.endereco && <div className="wizard-error-text">{localErrors.endereco}</div>}
        </div>

        <div className="wizard-form-group">
          <label className="wizard-label">Número *</label>
          <input
            type="text"
            value={data.numero}
            onChange={(e) => handleChange('numero', e.target.value)}
            onBlur={(e) => validateField('numero', e.target.value)}
            placeholder="Ex: 123"
            maxLength={20}
            className={`wizard-input ${localErrors.numero ? 'error' : ''}`}
          />
          {localErrors.numero && <div className="wizard-error-text">{localErrors.numero}</div>}
        </div>
      </div>
    );
  };

  const Step3Operation = ({ data, updateData }) => {
    const [localErrors, setLocalErrors] = useState({});

    const validateField = (field, value) => {
      let error = '';
      if (field === 'horaAbertura' && !value) error = 'Horário de abertura obrigatório';
      if (field === 'horaFechamento' && !value) error = 'Horário de fechamento obrigatório';
      
      if (field === 'maximoDeVagas') {
        if (!value || value <= 0) error = 'Mínimo 1 vaga';
      }
      if (field === 'vagasPreferenciais') {
        if (value < 0) error = 'Não pode ser negativo';
        if (value > data.maximoDeVagas) error = 'Maior que total de vagas';
      }

      setLocalErrors(prev => ({ ...prev, [field]: error }));
      if (error) {
        setToast({ message: error, type: 'error' });
      }
      return !error;
    };

    const handleChange = (field, value) => {
      updateData({ [field]: value });
      if (localErrors[field]) setLocalErrors(prev => ({ ...prev, [field]: '' }));
    };

    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="wizard-form-group">
            <label className="wizard-label">Horário de Abertura *</label>
            <input
              type="time"
              value={data.horaAbertura}
              onChange={(e) => handleChange('horaAbertura', e.target.value + ':00')}
              onBlur={(e) => validateField('horaAbertura', e.target.value)}
              className={`wizard-input ${localErrors.horaAbertura ? 'error' : ''}`}
            />
            {localErrors.horaAbertura && <div className="wizard-error-text">{localErrors.horaAbertura}</div>}
          </div>

          <div className="wizard-form-group">
            <label className="wizard-label">Horário de Fechamento *</label>
            <input
              type="time"
              value={data.horaFechamento}
              onChange={(e) => handleChange('horaFechamento', e.target.value + ':00')}
              onBlur={(e) => validateField('horaFechamento', e.target.value)}
              className={`wizard-input ${localErrors.horaFechamento ? 'error' : ''}`}
            />
            {localErrors.horaFechamento && <div className="wizard-error-text">{localErrors.horaFechamento}</div>}
          </div>
        </div>

        <div className="wizard-form-group">
          <label className="wizard-label">Total de Vagas *</label>
          <input
            type="number"
            min="1"
            max="2147483647"
            value={data.maximoDeVagas}
            onChange={(e) => handleChange('maximoDeVagas', parseInt(e.target.value) || 0)}
            onBlur={(e) => validateField('maximoDeVagas', parseInt(e.target.value) || 0)}
            placeholder="Ex: 50"
            className={`wizard-input ${localErrors.maximoDeVagas ? 'error' : ''}`}
          />
          {localErrors.maximoDeVagas && <div className="wizard-error-text">{localErrors.maximoDeVagas}</div>}
        </div>

        <div className="wizard-form-group">
          <label className="wizard-label">Vagas Preferenciais *</label>
          <input
            type="number"
            min="0"
            max={data.maximoDeVagas}
            value={data.vagasPreferenciais}
            onChange={(e) => handleChange('vagasPreferenciais', parseInt(e.target.value) || 0)}
            onBlur={(e) => validateField('vagasPreferenciais', parseInt(e.target.value) || 0)}
            placeholder="Ex: 5"
            className={`wizard-input ${localErrors.vagasPreferenciais ? 'error' : ''}`}
          />
          {localErrors.vagasPreferenciais && <div className="wizard-error-text">{localErrors.vagasPreferenciais}</div>}
          <div className="wizard-hint">Máximo: {data.maximoDeVagas} (total de vagas)</div>
        </div>
      </div>
    );
  };

  const Step4Legal = ({ data, updateData }) => {
    const [localErrors, setLocalErrors] = useState({});

    const validateField = (field, value) => {
      let error = '';
      if (field === 'numeroAlvaraDeFuncionamento' && !value.trim()) error = 'Alvará obrigatório';
      if (field === 'numeroDeEscrituraImovel' && !value.trim()) error = 'Escritura obrigatória';

      setLocalErrors(prev => ({ ...prev, [field]: error }));
      if (error) {
        setToast({ message: error, type: 'error' });
      }
      return !error;
    };

    const handleChange = (field, value) => {
      updateData({ [field]: value });
      if (localErrors[field]) setLocalErrors(prev => ({ ...prev, [field]: '' }));
    };

    return (
      <div>
        <div className="wizard-form-group">
          <label className="wizard-label">Número do Alvará de Funcionamento *</label>
          <input
            type="text"
            value={data.numeroAlvaraDeFuncionamento}
            onChange={(e) => handleChange('numeroAlvaraDeFuncionamento', e.target.value)}
            onBlur={(e) => validateField('numeroAlvaraDeFuncionamento', e.target.value)}
            placeholder="Ex: ALV-2024-00123"
            maxLength={100}
            className={`wizard-input ${localErrors.numeroAlvaraDeFuncionamento ? 'error' : ''}`}
          />
          {localErrors.numeroAlvaraDeFuncionamento && <div className="wizard-error-text">{localErrors.numeroAlvaraDeFuncionamento}</div>}
        </div>

        <div className="wizard-form-group">
          <label className="wizard-label">Número de Escritura do Imóvel *</label>
          <input
            type="text"
            value={data.numeroDeEscrituraImovel}
            onChange={(e) => handleChange('numeroDeEscrituraImovel', e.target.value)}
            onBlur={(e) => validateField('numeroDeEscrituraImovel', e.target.value)}
            placeholder="Ex: ESC-2024-00456"
            maxLength={100}
            className={`wizard-input ${localErrors.numeroDeEscrituraImovel ? 'error' : ''}`}
          />
          {localErrors.numeroDeEscrituraImovel && <div className="wizard-error-text">{localErrors.numeroDeEscrituraImovel}</div>}
        </div>
      </div>
    );
  };

  const validateStep1 = (data) => {
    const errors = {};
    if (!data.nome.trim()) errors.nome = 'Nome é obrigatório';
    else if (data.nome.length > 255) errors.nome = 'Nome muito longo';
    
    if (data.foto && data.foto.length > 500) errors.foto = 'URL muito longa';

    if (Object.keys(errors).length > 0) {
      setToast({ message: Object.values(errors)[0], type: 'error' });
      return false;
    }
    return true;
  };

  const validateStep2 = (data) => {
    const errors = {};
    if (!data.CEP.trim()) errors.CEP = 'CEP é obrigatório';
    else if (data.CEP.replace(/\D/g, '').length !== 8) errors.CEP = 'CEP inválido';
    
    if (!data.endereco.trim()) errors.endereco = 'Endereço é obrigatório';
    if (!data.numero.trim()) errors.numero = 'Número é obrigatório';

    if (Object.keys(errors).length > 0) {
      setToast({ message: Object.values(errors)[0], type: 'error' });
      return false;
    }
    return true;
  };

  const validateStep3 = (data) => {
    const errors = {};
    if (!data.horaAbertura) errors.horaAbertura = 'Horário de abertura obrigatório';
    if (!data.horaFechamento) errors.horaFechamento = 'Horário de fechamento obrigatório';
    
    if (data.horaAbertura && data.horaFechamento) {
      const abertura = data.horaAbertura.substring(0, 5);
      const fechamento = data.horaFechamento.substring(0, 5);
      if (abertura >= fechamento) errors.horaFechamento = 'Fechamento deve ser após abertura';
    }

    if (!data.maximoDeVagas || data.maximoDeVagas <= 0) errors.maximoDeVagas = 'Mínimo 1 vaga';
    if (data.vagasPreferenciais < 0) errors.vagasPreferenciais = 'Não pode ser negativo';
    if (data.vagasPreferenciais > data.maximoDeVagas) errors.vagasPreferenciais = 'Maior que total de vagas';

    if (Object.keys(errors).length > 0) {
      setToast({ message: Object.values(errors)[0], type: 'error' });
      return false;
    }
    return true;
  };

  const validateStep4 = (data) => {
    const errors = {};
    if (!data.numeroAlvaraDeFuncionamento.trim()) errors.numeroAlvaraDeFuncionamento = 'Alvará obrigatório';
    if (!data.numeroDeEscrituraImovel.trim()) errors.numeroDeEscrituraImovel = 'Escritura obrigatória';

    if (Object.keys(errors).length > 0) {
      setToast({ message: Object.values(errors)[0], type: 'error' });
      return false;
    }
    return true;
  };

  const wizardSteps = [
    { title: 'Informações Básicas', component: Step1BasicInfo, validate: validateStep1 },
    { title: 'Localização', component: Step2Location, validate: validateStep2 },
    { title: 'Operação', component: Step3Operation, validate: validateStep3 },
    { title: 'Documentação', component: Step4Legal, validate: validateStep4 }
  ];

  const handleWizardComplete = async (finalData) => {
    if (!donoId && !editingEstacionamento) {
      setToast({ message: 'Erro: Dono não identificado', type: 'error' });
      return;
    }

    setSubmitting(true);

    try {
      if (editingEstacionamento) {
        // Atualizar
        const updated = await estacionamentoService.update(editingEstacionamento.id, finalData);
        setEstacionamentos(prev => prev.map(est => 
          est.id === editingEstacionamento.id ? updated : est
        ));
        setToast({ message: 'Estacionamento atualizado com sucesso!', type: 'success' });
      } else {
        // Criar novo
        const created = await estacionamentoService.create(donoId, finalData);
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

  return (
    <div className="estacionamentos-dono-container">
      <Header
        title="Gerenciar Estacionamentos"
        subtitle="Gerencie seus estacionamentos, visualize estatísticas e acompanhe reservas"
        actions={
          <div className="header-actions">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="btn-refresh"
            >
              <MdRefresh size={20} className={refreshing ? 'spin-animation' : ''} />
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </button>
            
            <button
              onClick={() => handleOpenModal()}
              className="btn-novo-estacionamento"
            >
              <MdAdd size={20} />
              Novo Estacionamento
            </button>
          </div>
        }
      />
      
      <div className="estacionamentos-content">

      {estacionamentos.length === 0 && (
        <div className="empty-state">
          <MdLocalParking size={64} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <h3>Nenhum estacionamento cadastrado</h3>
          <p>
            Cadastre seu primeiro estacionamento para começar
          </p>
        </div>
      )}

      <div className="estacionamentos-grid">
        {estacionamentos.map(est => {
          const stats = calcularEstatisticas(est);
          const ocupacaoColor = getOcupacaoColor(stats.ocupacaoPercentual);

          return (
            <div 
              key={est.id} 
              className="estacionamento-card"
            >
              {/* Header com status */}
              <div className="card-header">
                <div className="card-header-content">
                  <div style={{ flex: 1 }}>
                    <h3 className="card-title">
                      {est.nome}
                    </h3>
                    <div className="card-address">
                      <MdLocationOn size={16} />
                      <span>{est.endereco}, {est.numero}</span>
                    </div>
                    <div className="card-cep">
                      CEP: {est.CEP}
                    </div>
                  </div>
                  
                  <div className={`status-badge ${est.status ? 'status-active' : 'status-inactive'}`}>
                    {est.status ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
              </div>

              {/* Ocupação e Horário */}
              <div className="card-body">
                {/* Barra de ocupação */}
                <div className="occupation-bar-container">
                  <div className="occupation-header">
                    <span className="occupation-label">
                      Ocupação
                    </span>
                    <span className="occupation-value" style={{ color: ocupacaoColor }}>
                      {stats.ocupacaoPercentual}%
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${stats.ocupacaoPercentual}%`, 
                        background: ocupacaoColor
                      }} 
                    />
                  </div>
                  <div className="occupation-stats">
                    <span>Livres: {stats.vagasDisponiveis}</span>
                    <span>Ocupadas: {stats.vagasOcupadas}</span>
                    <span>Total: {est.maximoDeVagas}</span>
                  </div>
                </div>

                {/* Horário de funcionamento */}
                <div className="schedule-info">
                  <MdSchedule size={18} style={{ color: '#6b7280' }} />
                  <span className="schedule-text">
                    {formatTime(est.horaAbertura)} - {formatTime(est.horaFechamento)}
                  </span>
                </div>
              </div>

              {/* Estatísticas em grid */}
              <div className="card-stats-grid">
                {/* Avaliações */}
                <div className="stat-item">
                  <div className="stat-value-container">
                    <MdStar size={20} style={{ color: '#f59e0b' }} />
                    <span className="stat-value">
                      {stats.mediaAvaliacoes}
                    </span>
                  </div>
                  <div className="stat-label">
                    {stats.totalAvaliacoes} avaliações
                  </div>
                </div>

                {/* Reservas Pendentes */}
                <div className="stat-item">
                  <div className="stat-value-container">
                    <MdAccessTime size={20} style={{ color: '#65a30d' }} />
                    <span className="stat-value">
                      {stats.reservasPendentes}
                    </span>
                  </div>
                  <div className="stat-label">
                    Pendentes
                  </div>
                </div>

                {/* Gerentes */}
                <div className="stat-item">
                  <div className="stat-value-container">
                    <MdPeople size={20} style={{ color: '#3f6212' }} />
                    <span className="stat-value">
                      {stats.totalGerentes}
                    </span>
                  </div>
                  <div className="stat-label">
                    Gerentes
                  </div>
                </div>
              </div>

              {/* Footer com ações e vagas preferenciais */}
              <div className="card-footer">
                <div className="footer-info">
                  <span style={{ fontWeight: '600' }}>Vagas Preferenciais:</span> {est.vagasPreferenciais}
                </div>
                
                <div className="footer-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenModal(est);
                    }}
                    className="btn-editar"
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
                    className="btn-desativar"
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

      {/* Wizard Modal */}
      {showModal && (
        <FormWizard
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingEstacionamento ? 'Editar Estacionamento' : 'Novo Estacionamento'}
          subtitle="Preencha as informações abaixo para cadastrar seu estacionamento"
          steps={wizardSteps}
          onComplete={handleWizardComplete}
          initialData={formData}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      </div>
    </div>
  );
};

export default EstacionamentosDono;
