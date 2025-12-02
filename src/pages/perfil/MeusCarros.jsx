import React, { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete, MdDirectionsCar, MdInfo, MdUpload, MdClose, MdCheckCircle } from 'react-icons/md';
import { CarCard, Header, FormWizard, Toast, Modal, ModalBody, ModalFooter, ModalActions, Button } from '../../components/shared';
import api from '../../utils/api';
import { usuarioService } from '../../utils/services';
import './MeusCarros.css';

const MeusCarros = () => {
  const [carros, setCarros] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCarro, setEditingCarro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    cor: '',
    apelido: '',
    vagaPreferencial: false,
    documentoComprobatorio: null
  });
  const [errors, setErrors] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [carroToDelete, setCarroToDelete] = useState(null);

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

  // Wizard Steps Components
  const Step1BasicInfo = ({ data, updateData }) => {
    const [localErrors, setLocalErrors] = useState({});

    const validateField = (field, value) => {
      let error = '';
      if (field === 'placa') {
        if (!value.trim()) error = 'Placa é obrigatória';
        else if (!validatePlacaMercosul(value)) error = 'Formato inválido (Mercosul: AAA0A00)';
        else if (!validateUnicidade(value, editingCarro?.id)) error = 'Placa já cadastrada';
      }
      if (field === 'modelo' && !value) error = 'Modelo é obrigatório';
      if (field === 'cor' && !value) error = 'Cor é obrigatória';

      setLocalErrors(prev => ({ ...prev, [field]: error }));
      return !error;
    };

    const handlePlacaChange = (e) => {
      const formatted = formatPlacaMercosul(e.target.value);
      updateData({ placa: formatted });
      if (localErrors.placa) setLocalErrors(prev => ({ ...prev, placa: '' }));
    };

    return (
      <div>
        <div className="wizard-form-group">
          <label className="wizard-label">Placa do Carro *</label>
          <input
            type="text"
            value={data.placa}
            onChange={handlePlacaChange}
            onBlur={(e) => validateField('placa', e.target.value)}
            placeholder="AAA0A00 (Formato Mercosul)"
            maxLength={7}
            className={`wizard-input ${localErrors.placa ? 'error' : ''}`}
          />
          {localErrors.placa && <div className="wizard-error-text">{localErrors.placa}</div>}
          <div className="wizard-hint">Formato Mercosul: 3 letras, 1 número, 1 letra, 2 números</div>
        </div>

        <div className="wizard-form-group">
          <label className="wizard-label">Modelo do Carro *</label>
          <select
            value={data.modelo}
            onChange={e => {
              updateData({ modelo: e.target.value });
              if (localErrors.modelo) setLocalErrors(prev => ({ ...prev, modelo: '' }));
            }}
            onBlur={(e) => validateField('modelo', e.target.value)}
            className={`wizard-select ${localErrors.modelo ? 'error' : ''}`}
          >
            <option value="">Selecione o modelo</option>
            {modelos.map(modelo => (
              <option key={modelo} value={modelo}>{modelo}</option>
            ))}
          </select>
          {localErrors.modelo && <div className="wizard-error-text">{localErrors.modelo}</div>}
        </div>

        <div className="wizard-form-group">
          <label className="wizard-label">Cor *</label>
          <select
            value={data.cor}
            onChange={e => {
              updateData({ cor: e.target.value });
              if (localErrors.cor) setLocalErrors(prev => ({ ...prev, cor: '' }));
            }}
            onBlur={(e) => validateField('cor', e.target.value)}
            className={`wizard-select ${localErrors.cor ? 'error' : ''}`}
          >
            <option value="">Selecione a cor</option>
            {cores.map(cor => (
              <option key={cor} value={cor}>{cor}</option>
            ))}
          </select>
          {localErrors.cor && <div className="wizard-error-text">{localErrors.cor}</div>}
        </div>

        <div className="wizard-form-group">
          <label className="wizard-label">Apelido (Opcional)</label>
          <input
            type="text"
            value={data.apelido}
            onChange={e => updateData({ apelido: e.target.value })}
            placeholder="Ex: Carro do Trabalho"
            maxLength={50}
            className="wizard-input"
          />
          <div className="wizard-hint">Nome amigável para identificar o veículo</div>
        </div>
      </div>
    );
  };

  const Step2Preferences = ({ data, updateData }) => {
    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        updateData({ documentoComprobatorio: file });
      }
    };

    return (
      <div>
        <div className="wizard-form-group">
          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={data.vagaPreferencial}
              onChange={e => updateData({ 
                vagaPreferencial: e.target.checked,
                documentoComprobatorio: e.target.checked ? data.documentoComprobatorio : null
              })}
              style={{ width: '18px', height: '18px' }}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
              Necessita de Vaga Preferencial (PCD ou Idoso)
            </span>
          </label>
          <div className="wizard-hint" style={{ marginLeft: '26px' }}>
            Marque se você possui direito a vaga preferencial
          </div>
        </div>

        {data.vagaPreferencial && (
          <div className="wizard-form-group" style={{ marginTop: '20px', animation: 'fadeIn 0.3s' }}>
            <label className="wizard-label">Documento Comprobatório *</label>
            <div className="file-upload" style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
              <input
                type="file"
                id="documento"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="file-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="documento" className="file-label" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <MdUpload size={24} color="#6b7280" />
                <span style={{ color: '#3b82f6', fontWeight: '500' }}>
                  {data.documentoComprobatorio 
                    ? data.documentoComprobatorio.name 
                    : 'Clique para enviar documento'
                  }
                </span>
              </label>
            </div>
            <div className="wizard-hint">
              Formatos aceitos: PDF, JPG, PNG. Máximo 5MB.
              <br />Documentos aceitos: CNH com observação, Carteirinha PCD, RG com idade 60+
            </div>
          </div>
        )}
      </div>
    );
  };

  const Step3Review = ({ data }) => {
    return (
      <div>
        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Resumo do Veículo
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280' }}>Placa</span>
              <span style={{ display: 'block', fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{data.placa}</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280' }}>Modelo</span>
              <span style={{ display: 'block', fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{data.modelo}</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280' }}>Cor</span>
              <span style={{ display: 'block', fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{data.cor}</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280' }}>Apelido</span>
              <span style={{ display: 'block', fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{data.apelido || '-'}</span>
            </div>
          </div>
        </div>

        <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Preferências
          </h4>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {data.vagaPreferencial ? (
              <>
                <MdCheckCircle color="#10b981" size={20} />
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>Necessita de vaga preferencial</span>
              </>
            ) : (
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Não necessita de vaga preferencial</span>
            )}
          </div>
          
          {data.vagaPreferencial && data.documentoComprobatorio && (
            <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
              Documento anexado: {data.documentoComprobatorio.name}
            </div>
          )}
        </div>
      </div>
    );
  };

  const validateStep1 = (data) => {
    const errors = {};
    if (!data.placa.trim()) errors.placa = 'Placa é obrigatória';
    else if (!validatePlacaMercosul(data.placa)) errors.placa = 'Formato inválido';
    else if (!validateUnicidade(data.placa, editingCarro?.id)) errors.placa = 'Placa já cadastrada';
    
    if (!data.modelo) errors.modelo = 'Modelo é obrigatório';
    if (!data.cor) errors.cor = 'Cor é obrigatória';

    if (Object.keys(errors).length > 0) {
      setToast({ message: Object.values(errors)[0], type: 'error' });
      return false;
    }
    return true;
  };

  const validateStep2 = (data) => {
    if (data.vagaPreferencial && !data.documentoComprobatorio && !editingCarro) {
      setToast({ message: 'Documento comprobatório é obrigatório para vaga preferencial', type: 'error' });
      return false;
    }
    return true;
  };

  const wizardSteps = [
    { title: 'Informações Básicas', component: Step1BasicInfo, validate: validateStep1 },
    { title: 'Preferências', component: Step2Preferences, validate: validateStep2 },
    { title: 'Revisão', component: Step3Review }
  ];

  const handleWizardComplete = async (finalData) => {
    if (!clienteId) {
      setToast({ message: 'Erro: Cliente não identificado. Faça login novamente.', type: 'error' });
      return;
    }
    
    setLoading(true);
    
    try {
      if (editingCarro) {
        // Editar carro existente
        const carroData = {
          clienteId: clienteId,
          placa: finalData.placa.toUpperCase(),
          modelo: finalData.modelo,
          cor: finalData.cor
        };
        
        const carroAtualizado = await api.put(`/carro/${editingCarro.id}`, carroData);
        
        setCarros(prev => prev.map(carro => 
          carro.id === editingCarro.id ? carroAtualizado : carro
        ));
        
        setToast({ message: 'Dados do veículo atualizados com sucesso!', type: 'success' });
      } else {
        // Adicionar novo carro
        const carroData = {
          clienteId: clienteId,
          placa: finalData.placa.toUpperCase(),
          modelo: finalData.modelo,
          cor: finalData.cor
        };
        
        await api.post('/carro', carroData);
        
        // Recarregar lista
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
        
        setToast({ message: 'Veículo cadastrado com sucesso!', type: 'success' });
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar carro:', error);
      setToast({ message: error.message || 'Erro ao salvar veículo. Tente novamente.', type: 'error' });
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

  const handleDelete = (carro) => {
    setCarroToDelete(carro);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!carroToDelete) return;
    
    setLoading(true);
    try {
      await api.delete(`/carro/${carroToDelete.id}`);
      setCarros(prev => prev.filter(c => c.id !== carroToDelete.id));
      setToast({ message: 'Veículo excluído com sucesso!', type: 'success' });
      setDeleteModalOpen(false);
      setCarroToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir carro:', error);
      setToast({ message: error.message || 'Erro ao excluir veículo. Tente novamente.', type: 'error' });
    } finally {
      setLoading(false);
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

      {/* Wizard Modal */}
      {showModal && (
        <FormWizard
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingCarro ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
          subtitle="Preencha as informações abaixo para cadastrar seu veículo"
          steps={wizardSteps}
          onComplete={handleWizardComplete}
          initialData={formData}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: '#fee2e2', 
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <MdDelete size={32} />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', color: '#111827' }}>Excluir Veículo</h3>
          <p style={{ margin: '0 0 24px', color: '#6b7280' }}>
            Tem certeza que deseja excluir o veículo <strong>{carroToDelete?.placa}</strong>? 
            Esta ação não pode ser desfeita.
          </p>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => setDeleteModalOpen(false)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#374151',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#ef4444',
                color: 'white',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Excluindo...' : 'Sim, Excluir'}
            </button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        /* Wizard Theme Overrides - InPark Brand */
        .wizard-progress-fill {
          background-color: #c2fe00 !important;
        }
        
        .btn-wizard-primary {
          background-color: #c2fe00 !important;
          color: #000000 !important;
          font-weight: 600 !important;
        }
        
        .btn-wizard-primary:hover {
          background-color: #b2e600 !important;
        }
        
        .btn-wizard-primary:disabled {
          background-color: #e5e7eb !important;
          color: #9ca3af !important;
        }
        
        .wizard-input:focus, 
        .wizard-select:focus {
          border-color: #c2fe00 !important;
          box-shadow: none !important;
        }
      `}</style>

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