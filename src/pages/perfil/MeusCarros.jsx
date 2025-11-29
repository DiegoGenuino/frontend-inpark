import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdDirectionsCar, MdInfo, MdUpload, MdClose, MdCheckCircle } from 'react-icons/md';
import { CarCard, Header } from '../../components/shared';
import api from '../../utils/api';
import { usuarioService } from '../../utils/services';
import './MeusCarros.css';

const MeusCarros = () => {
  const [carros, setCarros] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCarro, setEditingCarro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    cor: '',
    apelido: '',
    vagaPreferencial: false,
    documentoComprobatorio: null
  });
  const [errors, setErrors] = useState({});

  // Opções para dropdowns
  const modelos = [
    'Chevrolet Onix', 'Chevrolet Prisma', 'Chevrolet Tracker',
    'Ford Ka', 'Ford Fiesta', 'Ford EcoSport',
    'Volkswagen Gol', 'Volkswagen Polo', 'Volkswagen T-Cross',
    'Fiat Argo', 'Fiat Mobi', 'Fiat Toro',
    'Hyundai HB20', 'Hyundai Creta', 'Hyundai Tucson',
    'Toyota Corolla', 'Toyota Etios', 'Toyota Yaris',
    'Honda City', 'Honda Civic', 'Honda HR-V',
    'Nissan Kicks', 'Nissan Versa', 'Nissan March',
    'Renault Kwid', 'Renault Sandero', 'Renault Duster',
    'Outro'
  ];

  const cores = [
    'Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho',
    'Azul', 'Verde', 'Amarelo', 'Laranja', 'Roxo',
    'Marrom', 'Bege', 'Dourado', 'Outro'
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Buscar clienteId
        const userData = await usuarioService.getMe();
        
        if (userData && userData.id) {
          setClienteId(userData.id);
          
          // 2. Buscar carros do cliente
          const todosCarros = await api.get('/carro');
          const listaCarros = Array.isArray(todosCarros) ? todosCarros : (todosCarros.content || []);
          
          const carrosDoCliente = listaCarros.filter(c => {
            // Tentar diferentes formas de comparação
            return (
              c.cliente?.id === userData.id ||
              c.clienteId === userData.id ||
              c.cliente === userData.id ||
              String(c.cliente?.id) === String(userData.id) ||
              String(c.clienteId) === String(userData.id)
            );
          });
          
          setCarros(carrosDoCliente);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Validações
  const validatePlacaMercosul = (placa) => {
    // Formato Mercosul: AAA0A00 (3 letras, 1 número, 1 letra, 2 números)
    const mercosulPattern = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    return mercosulPattern.test(placa.replace(/[^A-Z0-9]/g, ''));
  };

  const validateUnicidade = (placa, excludeId = null) => {
    return !carros.some(carro => 
      carro.placa.replace(/[^A-Z0-9]/g, '') === placa.replace(/[^A-Z0-9]/g, '') && 
      carro.id !== excludeId
    );
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar placa
    if (!formData.placa.trim()) {
      newErrors.placa = 'Placa é obrigatória';
    } else if (!validatePlacaMercosul(formData.placa)) {
      newErrors.placa = 'Placa deve seguir o formato Mercosul (AAA0A00)';
    } else if (!validateUnicidade(formData.placa, editingCarro?.id)) {
      newErrors.placa = 'Esta placa já está cadastrada';
    }

    // Validar modelo
    if (!formData.modelo) {
      newErrors.modelo = 'Modelo é obrigatório';
    }

    // Validar cor
    if (!formData.cor) {
      newErrors.cor = 'Cor é obrigatória';
    }

    // Validar documento para vaga preferencial
    if (formData.vagaPreferencial && !formData.documentoComprobatorio && !editingCarro) {
      newErrors.documentoComprobatorio = 'Documento comprobatório é obrigatório para vaga preferencial';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!clienteId) {
      alert('Erro: Cliente não identificado. Faça login novamente.');
      return;
    }
    
    setLoading(true);
    
    try {
      if (editingCarro) {
        // Editar carro existente
        const carroData = {
          clienteId: clienteId,
          placa: formData.placa.toUpperCase(),
          modelo: formData.modelo,
          cor: formData.cor
        };
        
        const carroAtualizado = await api.put(`/carro/${editingCarro.id}`, carroData);
        
        setCarros(prev => prev.map(carro => 
          carro.id === editingCarro.id ? carroAtualizado : carro
        ));
        
        alert('Dados do veículo atualizados com sucesso!');
      } else {
        // Adicionar novo carro - ordem exata dos campos
        const carroData = {
          clienteId: clienteId,
          placa: formData.placa.toUpperCase(),
          modelo: formData.modelo,
          cor: formData.cor
        };
        
        console.log('Enviando carro:', carroData);
        
        const novoCarro = await api.post('/carro', carroData);
        
        // Recarregar lista de carros após cadastrar
        const todosCarros = await api.get('/carro');
        const listaCarros = Array.isArray(todosCarros) ? todosCarros : (todosCarros.content || []);
        const carrosDoCliente = listaCarros.filter(c => 
          c.cliente?.id === clienteId ||
          c.clienteId === clienteId ||
          c.cliente === clienteId ||
          String(c.cliente?.id) === String(clienteId) ||
          String(c.clienteId) === String(clienteId)
        );
        setCarros(carrosDoCliente);
        
        alert('Veículo cadastrado com sucesso!');
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar carro:', error);
      alert(error.message || 'Erro ao salvar veículo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (carro) => {
    setEditingCarro(carro);
    setFormData({
      placa: carro.placa,
      modelo: carro.modelo,
      cor: carro.cor,
      apelido: carro.apelido || '',
      vagaPreferencial: carro.vagaPreferencial || false,
      documentoComprobatorio: null
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (carro) => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja excluir o veículo "${carro.placa}"?\n\n` +
      'Esta ação não pode ser desfeita e todas as reservas futuras com este veículo serão afetadas.'
    );
    
    if (confirmacao) {
      setLoading(true);
      try {
        await api.delete(`/carro/${carro.id}`);
        setCarros(prev => prev.filter(c => c.id !== carro.id));
        alert('Veículo excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir carro:', error);
        alert(error.message || 'Erro ao excluir veículo. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSetPrincipal = (carroId) => {
    setCarros(prev => prev.map(carro => ({
      ...carro,
      principal: carro.id === carroId
    })));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCarro(null);
    setFormData({
      placa: '',
      modelo: '',
      cor: '',
      apelido: '',
      vagaPreferencial: false,
      documentoComprobatorio: null
    });
    setErrors({});
  };

  const formatPlacaMercosul = (value) => {
    // Remove caracteres especiais e converte para maiúsculo
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    // Aplica formato AAA0A00
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return cleaned.slice(0, 3) + cleaned.slice(3);
    } else if (cleaned.length <= 5) {
      return cleaned.slice(0, 3) + cleaned.slice(3, 4) + cleaned.slice(4);
    } else if (cleaned.length <= 7) {
      return cleaned.slice(0, 3) + cleaned.slice(3, 4) + cleaned.slice(4, 5) + cleaned.slice(5);
    }
    return cleaned.slice(0, 7);
  };

  const handlePlacaChange = (e) => {
    const formatted = formatPlacaMercosul(e.target.value);
    setFormData(prev => ({ ...prev, placa: formatted }));
    
    // Limpar erro de placa ao digitar
    if (errors.placa) {
      setErrors(prev => ({ ...prev, placa: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, documentoComprobatorio: file }));
      if (errors.documentoComprobatorio) {
        setErrors(prev => ({ ...prev, documentoComprobatorio: '' }));
      }
    }
  };

  return (
    <div className="meus-carros-container">
      <Header 
        title="Meus Carros"
        subtitle="Gerencie os veículos cadastrados em sua conta para facilitar suas reservas"
      />

      {/* Botão Adicionar Novo Carro */}
      <div className="add-car-section">
        <button className="btn-add-carro" onClick={() => setShowModal(true)}>
          <MdAdd />
          Adicionar Novo Carro
        </button>
      </div>

      {/* Lista de Carros */}
      <div className="carros-grid">
        {carros.length === 0 ? (
          <div className="no-carros">
            <MdDirectionsCar size={64} />
            <h3>Nenhum veículo cadastrado</h3>
            <p>Adicione seus veículos para facilitar as reservas de estacionamento</p>
          </div>
        ) : (
          carros.map(carro => (
            <CarCard
              key={carro.id}
              car={carro}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetPrincipal={handleSetPrincipal}
            />
          ))
        )}
      </div>

      {/* Modal de Adicionar/Editar */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCarro ? 'Editar Veículo' : 'Adicionar Novo Veículo'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <MdClose />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="carro-form">
              {/* Placa do Carro */}
              <div className="form-group">
                <label htmlFor="placa">Placa do Carro *</label>
                <input
                  type="text"
                  id="placa"
                  value={formData.placa}
                  onChange={handlePlacaChange}
                  placeholder="AAA0A00 (Formato Mercosul)"
                  maxLength={7}
                  className={errors.placa ? 'error' : ''}
                />
                {errors.placa && <span className="error-message">{errors.placa}</span>}
                <small className="field-hint">Formato Mercosul: 3 letras, 1 número, 1 letra, 2 números</small>
              </div>

              {/* Modelo do Carro */}
              <div className="form-group">
                <label htmlFor="modelo">Modelo do Carro *</label>
                <select
                  id="modelo"
                  value={formData.modelo}
                  onChange={e => setFormData(prev => ({ ...prev, modelo: e.target.value }))}
                  className={errors.modelo ? 'error' : ''}
                >
                  <option value="">Selecione o modelo</option>
                  {modelos.map(modelo => (
                    <option key={modelo} value={modelo}>{modelo}</option>
                  ))}
                </select>
                {errors.modelo && <span className="error-message">{errors.modelo}</span>}
              </div>

              {/* Cor */}
              <div className="form-group">
                <label htmlFor="cor">Cor *</label>
                <select
                  id="cor"
                  value={formData.cor}
                  onChange={e => setFormData(prev => ({ ...prev, cor: e.target.value }))}
                  className={errors.cor ? 'error' : ''}
                >
                  <option value="">Selecione a cor</option>
                  {cores.map(cor => (
                    <option key={cor} value={cor}>{cor}</option>
                  ))}
                </select>
                {errors.cor && <span className="error-message">{errors.cor}</span>}
              </div>

              {/* Apelido */}
              <div className="form-group">
                <label htmlFor="apelido">Apelido (Opcional)</label>
                <input
                  type="text"
                  id="apelido"
                  value={formData.apelido}
                  onChange={e => setFormData(prev => ({ ...prev, apelido: e.target.value }))}
                  placeholder="Ex: Carro do Trabalho, Carro da Família"
                  maxLength={50}
                />
                <small className="field-hint">Nome amigável para identificar o veículo</small>
              </div>

              {/* Tipo de Vaga Preferencial */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.vagaPreferencial}
                    onChange={e => setFormData(prev => ({ 
                      ...prev, 
                      vagaPreferencial: e.target.checked,
                      documentoComprobatorio: e.target.checked ? prev.documentoComprobatorio : null
                    }))}
                  />
                  <span className="checkmark"></span>
                  Necessita de Vaga Preferencial (PCD ou Idoso)
                </label>
                <small className="field-hint">Marque se você possui direito a vaga preferencial</small>
              </div>

              {/* Upload de Documento (se vaga preferencial marcada) */}
              {formData.vagaPreferencial && (
                <div className="form-group">
                  <label htmlFor="documento">Documento Comprobatório *</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="documento"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="file-input"
                    />
                    <label htmlFor="documento" className="file-label">
                      <MdUpload />
                      {formData.documentoComprobatorio 
                        ? formData.documentoComprobatorio.name 
                        : 'Clique para enviar documento'
                      }
                    </label>
                  </div>
                  {errors.documentoComprobatorio && (
                    <span className="error-message">{errors.documentoComprobatorio}</span>
                  )}
                  <small className="field-hint">
                    Formatos aceitos: PDF, JPG, PNG. Máximo 5MB.
                    <br />Documentos aceitos: CNH com observação, Carteirinha PCD, RG com idade 60+
                  </small>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {editingCarro ? 'Atualizar Dados' : 'Salvar Carro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Informações Adicionais */}
      <div className="info-section">
        <div className="info-card">
          <MdInfo />
          <div>
            <h4>Sobre o Veículo Principal</h4>
            <p>O veículo marcado como principal será selecionado automaticamente ao fazer novas reservas, agilizando o processo.</p>
          </div>
        </div>
        
        <div className="info-card">
          <MdDirectionsCar />
          <div>
            <h4>Vagas Preferenciais</h4>
            <p>Veículos com direito a vaga preferencial têm prioridade na reserva e acesso a vagas específicas para PCD e idosos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeusCarros;