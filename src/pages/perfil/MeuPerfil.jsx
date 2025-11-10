import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/auth';
import { 
  MdPerson, 
  MdEdit, 
  MdSave, 
  MdCancel,
  MdEmail,
  MdPhone,
  MdBadge
} from 'react-icons/md';
import { Toast } from '../../components/shared';
import './MeuPerfil.css';

const MeuPerfil = () => {
  const { user, updateUser } = useAuth();
  
  // Estados para controle de edição
  const [editingSection, setEditingSection] = useState(null);

  // Estado para Toast
  const [toast, setToast] = useState(null);
  
  // Estados dos formulários
  const [dadosPersonais, setDadosPersonais] = useState({
    nome: '',
    email: '',
    telefone: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Carregar dados do usuário
    if (user) {
      setDadosPersonais({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || ''
      });
    }
  }, [user]);

  // Formatadores e validadores
  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handlers para dados pessoais
  const handleEditDadosPersonais = () => {
    setEditingSection('dadosPersonais');
  };

  const handleSaveDadosPersonais = async () => {
    if (!dadosPersonais.nome.trim()) {
      setToast({ message: 'Nome é obrigatório', type: 'error' });
      return;
    }
    
    if (!validateEmail(dadosPersonais.email)) {
      setToast({ message: 'Email inválido', type: 'error' });
      return;
    }
    
    if (!dadosPersonais.telefone.trim()) {
      setToast({ message: 'Telefone é obrigatório', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar dados do usuário no contexto
      if (updateUser) {
        updateUser({
          ...user,
          nome: dadosPersonais.nome,
          email: dadosPersonais.email,
          telefone: dadosPersonais.telefone
        });
      }
      
      setEditingSection(null);
      setToast({ message: 'Dados atualizados com sucesso!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao salvar dados. Tente novamente.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Restaurar dados originais
    if (user) {
      setDadosPersonais({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || ''
      });
    }
    setEditingSection(null);
  };

  return (
    <div className="meu-perfil-container">
      <div className="page-header">
        <div className="header-text">
        <p>Gerencie suas informações pessoais e configurações</p>
        <h1>Meu Perfil</h1>
        </div>
      </div>

      <div className="perfil-content">
        {/* Seção 1: Dados Pessoais */}
        <section className="perfil-section">
          <div className="section-header">
            <div className="section-title">
              <MdPerson className="section-icon" />
              <h2>Dados Pessoais</h2>
            </div>
            {editingSection !== 'dadosPersonais' && (
              <button className="btn-edit" onClick={handleEditDadosPersonais}>
                <MdEdit />
                Editar
              </button>
            )}
          </div>

          <div className="section-content">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nome">Nome Completo *</label>
                {editingSection === 'dadosPersonais' ? (
                  <div className="input-with-icon">
                    <MdBadge className="input-icon" />
                    <input
                      type="text"
                      id="nome"
                      value={dadosPersonais.nome}
                      onChange={(e) => setDadosPersonais(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Seu nome completo"
                    />
                  </div>
                ) : (
                  <div className="display-value">{dadosPersonais.nome || 'Não informado'}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <div className="display-value readonly">
                  {user?.cpf ? formatCPF(user.cpf) : '000.000.000-00'}
                  <span className="readonly-note">Não editável</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail *</label>
                {editingSection === 'dadosPersonais' ? (
                  <div className="input-with-icon">
                    <MdEmail className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      value={dadosPersonais.email}
                      onChange={(e) => setDadosPersonais(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                    />
                  </div>
                ) : (
                  <div className="display-value">{dadosPersonais.email || 'Não informado'}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone *</label>
                {editingSection === 'dadosPersonais' ? (
                  <div className="input-with-icon">
                    <MdPhone className="input-icon" />
                    <input
                      type="text"
                      id="telefone"
                      value={dadosPersonais.telefone}
                      onChange={(e) => setDadosPersonais(prev => ({ 
                        ...prev, 
                        telefone: formatTelefone(e.target.value) 
                      }))}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>
                ) : (
                  <div className="display-value">{dadosPersonais.telefone || 'Não informado'}</div>
                )}
              </div>
            </div>

            {editingSection === 'dadosPersonais' && (
              <div className="section-actions">
                <button className="btn-cancel" onClick={handleCancelEdit} disabled={loading}>
                  <MdCancel />
                  Cancelar
                </button>
                <button className="btn-save" onClick={handleSaveDadosPersonais} disabled={loading}>
                  <MdSave />
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Toast Notification */}
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