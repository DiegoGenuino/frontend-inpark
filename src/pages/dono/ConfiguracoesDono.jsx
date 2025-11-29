import React, { useState, useEffect } from 'react';
import Header from '../../components/shared/Header';
import './ConfiguracoesDono.css';

const ConfiguracoesDono = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);
  const [idioma, setIdioma] = useState('pt-BR');
  const [emailNotificacoes, setEmailNotificacoes] = useState(true);

  // Carregar preferências salvas
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedNotificacoes = localStorage.getItem('notificacoes') !== 'false';
    const savedIdioma = localStorage.getItem('idioma') || 'pt-BR';
    const savedEmailNotif = localStorage.getItem('emailNotificacoes') !== 'false';

    setDarkMode(savedDarkMode);
    setNotificacoes(savedNotificacoes);
    setIdioma(savedIdioma);
    setEmailNotificacoes(savedEmailNotif);
  }, []);

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', newValue.toString());
    
    // TODO: Aplicar dark mode globalmente
    if (newValue) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  const handleNotificacoesToggle = () => {
    const newValue = !notificacoes;
    setNotificacoes(newValue);
    localStorage.setItem('notificacoes', newValue.toString());
  };

  const handleEmailNotificacoesToggle = () => {
    const newValue = !emailNotificacoes;
    setEmailNotificacoes(newValue);
    localStorage.setItem('emailNotificacoes', newValue.toString());
  };

  const handleIdiomaChange = (e) => {
    const newValue = e.target.value;
    setIdioma(newValue);
    localStorage.setItem('idioma', newValue);
  };

  return (
    <div className="configuracoes-dono-page">
      <Header 
        title="Configurações"
        subtitle="Personalize sua experiência no InPark"
      />

      {/* Seção: Aparência */}
      <div className="config-section">
        <div className="config-section-header">
          <h2 className="config-section-title">Aparência</h2>
          <p className="config-section-description">
            Personalize a interface do sistema
          </p>
        </div>

        <div className="config-option">
          <div className="config-option-info">
            <h3 className="config-option-label">Modo Escuro</h3>
            <p className="config-option-description">
              Ativa o tema escuro em todo o sistema
            </p>
          </div>
          <div className="config-option-control">
            <button
              className={`toggle-switch ${darkMode ? 'active' : ''}`}
              onClick={handleDarkModeToggle}
              aria-label="Toggle Dark Mode"
            >
              <div className="toggle-switch-slider" />
            </button>
          </div>
        </div>

        <div className="config-option">
          <div className="config-option-info">
            <h3 className="config-option-label">Idioma</h3>
            <p className="config-option-description">
              Selecione o idioma do sistema
            </p>
          </div>
          <div className="config-option-control">
            <select 
              className="config-select" 
              value={idioma}
              onChange={handleIdiomaChange}
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español (ES)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seção: Notificações */}
      <div className="config-section">
        <div className="config-section-header">
          <h2 className="config-section-title">Notificações</h2>
          <p className="config-section-description">
            Gerencie como você recebe atualizações
          </p>
        </div>

        <div className="config-option">
          <div className="config-option-info">
            <h3 className="config-option-label">Notificações Push</h3>
            <p className="config-option-description">
              Receba notificações em tempo real sobre novas reservas
            </p>
          </div>
          <div className="config-option-control">
            <button
              className={`toggle-switch ${notificacoes ? 'active' : ''}`}
              onClick={handleNotificacoesToggle}
              aria-label="Toggle Notificações"
            >
              <div className="toggle-switch-slider" />
            </button>
          </div>
        </div>

        <div className="config-option">
          <div className="config-option-info">
            <h3 className="config-option-label">Notificações por E-mail</h3>
            <p className="config-option-description">
              Receba resumos diários e alertas importantes no seu e-mail
            </p>
          </div>
          <div className="config-option-control">
            <button
              className={`toggle-switch ${emailNotificacoes ? 'active' : ''}`}
              onClick={handleEmailNotificacoesToggle}
              aria-label="Toggle E-mail Notificações"
            >
              <div className="toggle-switch-slider" />
            </button>
          </div>
        </div>
      </div>

      {/* Seção: Sistema */}
      <div className="config-section">
        <div className="config-section-header">
          <h2 className="config-section-title">Sistema</h2>
          <p className="config-section-description">
            Informações e ações do sistema
          </p>
        </div>

        <div className="config-option">
          <div className="config-option-info">
            <h3 className="config-option-label">Versão do Sistema</h3>
            <p className="config-option-description">
              InPark Dashboard v1.0.0
            </p>
          </div>
          <div className="config-option-control">
            <span className="config-badge active">Atualizado</span>
          </div>
        </div>

        <div className="config-option">
          <div className="config-option-info">
            <h3 className="config-option-label">Limpar Cache</h3>
            <p className="config-option-description">
              Remove dados temporários e recarrega o sistema
            </p>
          </div>
          <div className="config-option-control">
            <button 
              className="config-action-button"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Limpar Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesDono;
