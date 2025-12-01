import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/auth';
import api from '../../utils/api';
import { 
  MdPerson, 
  MdEdit, 
  MdEmail,
  MdCalendarToday
} from 'react-icons/md';
import { Toast, Header } from '../../components/shared';
import './MeuPerfil.css';

const MeuPerfil = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [senha, setSenha] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    dataNascimento: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await api.post('/auth/me');
      setUserData(data);
      setFormData({
        nome: data.nome || '',
        email: data.email || '',
        dataNascimento: data.dataNascimento ? new Date(data.dataNascimento).toISOString().split('T')[0] : ''
      });
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      setToast({ message: 'Erro ao carregar perfil', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFieldClick = (fieldName) => {
    setEditingField(fieldName);
  };

  const handleFieldBlur = (fieldName) => {
    setEditingField(null);
    
    // Verificar se o valor realmente mudou
    const currentValue = formData[fieldName];
    let originalValue = userData[fieldName];
    
    // Para data, converter para formato comparável
    if (fieldName === 'dataNascimento' && originalValue) {
      originalValue = new Date(originalValue).toISOString().split('T')[0];
    }
    
    if (currentValue !== originalValue && !(currentValue === '' && !originalValue)) {
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    setShowPasswordModal(true);
  };

  const handleConfirmSave = async () => {
    if (!senha) {
      setToast({ message: 'Senha é obrigatória para salvar alterações', type: 'error' });
      return;
    }

    try {
      // IMPORTANTE: A senha aqui NÃO deve ser usada para alterar a senha do usuário!
      // O backend deve verificar se a senha está correta (autenticação)
      // mas NÃO deve atualizar o campo senha no banco de dados.
      // Apenas nome, email e dataNascimento devem ser atualizados.
      const dataToSend = {
        nome: formData.nome,
        email: formData.email,
        senha: senha, // Apenas para validação de identidade
        dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento).toISOString() : null
      };

      await api.put(`/cliente/${userData.id}`, dataToSend);
      
      setToast({ message: 'Perfil atualizado com sucesso!', type: 'success' });
      setHasChanges(false);
      setShowPasswordModal(false);
      setSenha('');
      fetchUserData();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      
      // Verificar se é erro de senha incorreta (geralmente 400 ou 401)
      let errorMessage = 'Erro ao atualizar perfil';
      
      if (error.message.includes('400') || error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Senha incorreta. Verifique e tente novamente.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setToast({ message: errorMessage, type: 'error' });
      // Não fecha o modal para permitir nova tentativa
    }
  };

  const handleCancelChanges = () => {
    fetchUserData();
    setHasChanges(false);
  };

  const handleKeyDown = (e, fieldName) => {
    if (e.key === 'Enter') {
      e.target.blur();
    } else if (e.key === 'Escape') {
      setEditingField(null);
      fetchUserData();
    }
  };

  // Gera URL do avatar usando UI Avatars API
  const getAvatarUrl = (name) => {
    if (!name) return `https://ui-avatars.com/api/?name=Usuario&background=10b981&color=fff&size=200&bold=true`;
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff&size=200&bold=true`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="meu-perfil-container" style={{ background: '#f9fafb' }}>
        <Header title="Meu Perfil" subtitle="Clique nos campos para editar suas informações" />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="meu-perfil-container" style={{ background: '#f9fafb' }}>
      <Header 
        title="Meu Perfil"
        subtitle="Clique nos campos para editar suas informações"
      />

      <div className="perfil-content">
        <div className="perfil-view">
          <div className="profile-header">
            <div className="avatar-container">
              <img 
                src={getAvatarUrl(userData?.nome)} 
                alt={userData?.nome || 'Avatar'} 
                className="avatar-image"
              />
            </div>
            <div className="profile-info">
              <h2>{userData?.nome || 'Nome não informado'}</h2>
              <p className="profile-role">Cliente InPark</p>
            </div>
          </div>

          <div className="info-section">
            <h3 className="perfil-section-title">Informações Pessoais</h3>
            <div className="info-grid">
              <div className="info-item editable" onClick={() => handleFieldClick('nome')}>
                <div className="info-label">
                  <MdPerson className="info-icon" />
                  Nome Completo
                  <MdEdit className="edit-icon" size={14} />
                </div>
                {editingField === 'nome' ? (
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    onBlur={() => handleFieldBlur('nome')}
                    onKeyDown={(e) => handleKeyDown(e, 'nome')}
                    className="inline-edit-input"
                    autoFocus
                  />
                ) : (
                  <div className="info-value">{userData?.nome || 'Clique para adicionar'}</div>
                )}
              </div>

              <div className="info-item editable" onClick={() => handleFieldClick('email')}>
                <div className="info-label">
                  <MdEmail className="info-icon" />
                  E-mail
                  <MdEdit className="edit-icon" size={14} />
                </div>
                {editingField === 'email' ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleFieldBlur('email')}
                    onKeyDown={(e) => handleKeyDown(e, 'email')}
                    className="inline-edit-input"
                    autoFocus
                  />
                ) : (
                  <div className="info-value">{userData?.email || 'Clique para adicionar'}</div>
                )}
              </div>

              <div className="info-item editable" onClick={() => handleFieldClick('dataNascimento')}>
                <div className="info-label">
                  <MdCalendarToday className="info-icon" />
                  Data de Nascimento
                  <MdEdit className="edit-icon" size={14} />
                </div>
                {editingField === 'dataNascimento' ? (
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    onBlur={() => handleFieldBlur('dataNascimento')}
                    onKeyDown={(e) => handleKeyDown(e, 'dataNascimento')}
                    className="inline-edit-input"
                    autoFocus
                  />
                ) : (
                  <div className="info-value">{formatDate(userData?.dataNascimento)}</div>
                )}
              </div>
            </div>
          </div>

          {hasChanges && (
            <div style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              display: 'flex',
              gap: '0.75rem',
              background: '#ffffff',
              padding: '1rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid #e5e7eb',
              zIndex: 1000
            }}>
              <button
                onClick={handleCancelChanges}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#ffffff',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Salvar Alterações
              </button>
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#111827' }}>Confirme sua senha</h3>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.875rem', color: '#6b7280' }}>Para salvar as alterações, digite sua senha:</p>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmSave()}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowPasswordModal(false); setSenha(''); }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#ffffff',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSave}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MeuPerfil;