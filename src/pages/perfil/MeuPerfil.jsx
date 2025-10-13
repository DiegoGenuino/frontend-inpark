import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/auth';
import { 
  MdPerson, 
  MdSecurity, 
  MdSettings, 
  MdEdit, 
  MdSave, 
  MdCancel,
  MdVisibility,
  MdVisibilityOff,
  MdEmail,
  MdPhone,
  MdLock,
  MdNotifications,
  MdDeleteForever,
  MdHelp,
  MdDescription,
  MdPrivacyTip
} from 'react-icons/md';
import './MeuPerfil.css';

const MeuPerfil = () => {
  const { user, updateUser } = useAuth();
  
  // Estados para controle de edição
  const [editingSection, setEditingSection] = useState(null);
  const [showPassword, setShowPassword] = useState({
    atual: false,
    nova: false,
    confirmacao: false
  });
  
  // Estados dos formulários
  const [dadosPersonais, setDadosPersonais] = useState({
    nome: '',
    email: '',
    telefone: ''
  });
  
  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmacaoSenha: ''
  });
  
  const [preferencias, setPreferencias] = useState({
    notificacoesPush: true,
    notificacoesEmail: true,
    notificacoesSMS: false
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
    
    // Carregar preferências (simulado)
    setPreferencias({
      notificacoesPush: true,
      notificacoesEmail: true,
      notificacoesSMS: false
    });
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

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Handlers para dados pessoais
  const handleEditDadosPersonais = () => {
    setEditingSection('dadosPersonais');
  };

  const handleSaveDadosPersonais = async () => {
    if (!dadosPersonais.nome.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    
    if (!validateEmail(dadosPersonais.email)) {
      alert('Email inválido');
      return;
    }
    
    if (!dadosPersonais.telefone.trim()) {
      alert('Telefone é obrigatório');
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
      alert('Dados atualizados com sucesso!');
    } catch (error) {
      alert('Erro ao salvar dados. Tente novamente.');
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

  // Handlers para senha
  const handleAlterarSenha = async () => {
    if (!senhaData.senhaAtual) {
      alert('Senha atual é obrigatória');
      return;
    }
    
    if (!validatePassword(senhaData.novaSenha)) {
      alert('Nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (senhaData.novaSenha !== senhaData.confirmacaoSenha) {
      alert('Confirmação de senha não confere');
      return;
    }

    setLoading(true);
    try {
      // Simular alteração de senha
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSenhaData({
        senhaAtual: '',
        novaSenha: '',
        confirmacaoSenha: ''
      });
      
      alert('Senha alterada com sucesso!');
    } catch (error) {
      alert('Erro ao alterar senha. Verifique sua senha atual.');
    } finally {
      setLoading(false);
    }
  };

  // Handlers para preferências
  const handleSavePreferencias = async () => {
    setLoading(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 800));
      alert('Preferências atualizadas com sucesso!');
    } catch (error) {
      alert('Erro ao salvar preferências. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Handler para exclusão da conta
  const handleSolicitarExclusao = () => {
    const confirmacao = window.confirm(
      'Tem certeza que deseja solicitar a exclusão da sua conta? Esta ação não pode ser desfeita.\n\n' +
      'Você receberá um email com instruções para confirmar a exclusão.'
    );
    
    if (confirmacao) {
      alert('Solicitação de exclusão enviada. Verifique seu email para confirmar.');
    }
  };

  return (
    <div className="meu-perfil-container">
      <div className="page-header">
        <h1>Meu Perfil</h1>
        <p>Gerencie suas informações pessoais e configurações da conta</p>
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
                  <input
                    type="text"
                    id="nome"
                    value={dadosPersonais.nome}
                    onChange={(e) => setDadosPersonais(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Seu nome completo"
                  />
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

        {/* Seção 2: Segurança */}
        <section className="perfil-section">
          <div className="section-header">
            <div className="section-title">
              <MdSecurity className="section-icon" />
              <h2>Segurança</h2>
            </div>
          </div>

          <div className="section-content">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="senhaAtual">Senha Atual *</label>
                <div className="input-with-icon">
                  <MdLock className="input-icon" />
                  <input
                    type={showPassword.atual ? 'text' : 'password'}
                    id="senhaAtual"
                    value={senhaData.senhaAtual}
                    onChange={(e) => setSenhaData(prev => ({ ...prev, senhaAtual: e.target.value }))}
                    placeholder="Digite sua senha atual"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(prev => ({ ...prev, atual: !prev.atual }))}
                  >
                    {showPassword.atual ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="novaSenha">Nova Senha *</label>
                <div className="input-with-icon">
                  <MdLock className="input-icon" />
                  <input
                    type={showPassword.nova ? 'text' : 'password'}
                    id="novaSenha"
                    value={senhaData.novaSenha}
                    onChange={(e) => setSenhaData(prev => ({ ...prev, novaSenha: e.target.value }))}
                    placeholder="Digite sua nova senha"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(prev => ({ ...prev, nova: !prev.nova }))}
                  >
                    {showPassword.nova ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
                <small className="field-hint">Mínimo de 6 caracteres</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmacaoSenha">Confirmação da Nova Senha *</label>
                <div className="input-with-icon">
                  <MdLock className="input-icon" />
                  <input
                    type={showPassword.confirmacao ? 'text' : 'password'}
                    id="confirmacaoSenha"
                    value={senhaData.confirmacaoSenha}
                    onChange={(e) => setSenhaData(prev => ({ ...prev, confirmacaoSenha: e.target.value }))}
                    placeholder="Confirme sua nova senha"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(prev => ({ ...prev, confirmacao: !prev.confirmacao }))}
                  >
                    {showPassword.confirmacao ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>
            </div>

            <div className="section-actions">
              <button className="btn-primary" onClick={handleAlterarSenha} disabled={loading}>
                <MdSecurity />
                {loading ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </div>
          </div>
        </section>

        {/* Seção 3: Preferências */}
        <section className="perfil-section">
          <div className="section-header">
            <div className="section-title">
              <MdSettings className="section-icon" />
              <h2>Preferências</h2>
            </div>
          </div>

          <div className="section-content">
            <div className="preferences-grid">
              <div className="preference-item">
                <div className="preference-info">
                  <MdNotifications className="preference-icon" />
                  <div>
                    <h4>Notificações Push</h4>
                    <p>Receba notificações no aplicativo</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferencias.notificacoesPush}
                    onChange={(e) => setPreferencias(prev => ({ 
                      ...prev, 
                      notificacoesPush: e.target.checked 
                    }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <MdEmail className="preference-icon" />
                  <div>
                    <h4>Notificações por E-mail</h4>
                    <p>Receba atualizações por email</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferencias.notificacoesEmail}
                    onChange={(e) => setPreferencias(prev => ({ 
                      ...prev, 
                      notificacoesEmail: e.target.checked 
                    }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <MdPhone className="preference-icon" />
                  <div>
                    <h4>Notificações por SMS</h4>
                    <p>Receba alertas por mensagem de texto</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferencias.notificacoesSMS}
                    onChange={(e) => setPreferencias(prev => ({ 
                      ...prev, 
                      notificacoesSMS: e.target.checked 
                    }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="section-actions">
              <button className="btn-primary" onClick={handleSavePreferencias} disabled={loading}>
                <MdSave />
                {loading ? 'Salvando...' : 'Salvar Preferências'}
              </button>
            </div>
          </div>
        </section>

        {/* Seção de Links e Ações */}
        <section className="perfil-section">
          <div className="section-header">
            <div className="section-title">
              <MdHelp className="section-icon" />
              <h2>Ajuda e Informações</h2>
            </div>
          </div>

          <div className="section-content">
            <div className="info-links">
              <a href="/termos-de-uso" className="info-link">
                <MdDescription />
                <span>Termos de Uso</span>
              </a>
              <a href="/politica-privacidade" className="info-link">
                <MdPrivacyTip />
                <span>Política de Privacidade</span>
              </a>
              <a href="/ajuda" className="info-link">
                <MdHelp />
                <span>Ajuda/FAQ</span>
              </a>
            </div>

            <div className="danger-zone">
              <h4>Zona de Perigo</h4>
              <p>Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.</p>
              <button className="btn-danger" onClick={handleSolicitarExclusao}>
                <MdDeleteForever />
                Solicitar Exclusão da Conta
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MeuPerfil;