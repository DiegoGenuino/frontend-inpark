import React, { useState } from "react";
import { useAuth } from "../../utils/auth";
import InparkLogo from "../../assets/inpark-logo.svg";
import "./Login.css";

export const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    senha: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para preencher credenciais de teste rapidamente
  const handleFillTestCredentials = () => {
    setCredentials({
      email: "demo@inpark.com",
      senha: "demo123"
    });
    setError(""); // Limpar erros
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Fazer login com o backend
      const result = await login(credentials.email, credentials.senha);

      if (!result.success) {
        setError(result.error || "Email ou senha incorretos");
      }
      // Se success=true, o AuthProvider já atualizou o estado e o usuário será redirecionado
    } catch (error) {
      console.error('Erro no login:', error);
      setError("Erro ao fazer login. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para obter feedback do email
  const getEmailFeedback = () => {
    if (!credentials.email) {
      return { text: 'Digite seu email para continuar', type: 'neutral' };
    }
    if (credentials.email.includes('@') && credentials.email.includes('.')) {
      return { text: '✓ Email válido', type: 'valid' };
    }
    return { text: 'Digite um email válido', type: 'warning' };
  };

  // Função para obter feedback da senha
  const getSenhaFeedback = () => {
    if (!credentials.senha) {
      return { text: 'Digite sua senha para acessar', type: 'neutral' };
    }
    if (credentials.senha.length >= 6) {
      return { text: '✓ Senha válida', type: 'valid' };
    }
    return { text: 'Senha deve ter pelo menos 6 caracteres', type: 'warning' };
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={InparkLogo} alt="Inpark Logo" />
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="error-message">{error}</div>}
        
        <img
          src={InparkLogo}
          alt="Logotipo inpark"
          className="logotipo-inpark"
        />
        
        <h2>Acesse sua conta</h2>
        
        {/* Mensagem informativa sobre credenciais de teste */}
        <div style={{
          backgroundColor: '#e8f5e9',
          border: '1px solid #4caf50',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '13px',
          color: '#2e7d32'
        }}>
          <strong>💡 Teste sem backend:</strong><br />
          Email: <code style={{ 
            backgroundColor: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>demo@inpark.com</code><br />
          Senha: <code style={{ 
            backgroundColor: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>demo123</code>
          <button 
            type="button"
            onClick={handleFillTestCredentials}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              width: '100%'
            }}
          >
            ⚡ Preencher credenciais de teste
          </button>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            placeholder="Digite seu email"
            required
            disabled={loading}
          />
          <span 
            className="input-feedback"
            data-valid={getEmailFeedback().type === 'valid'}
            data-warning={getEmailFeedback().type === 'warning'}
            data-neutral={getEmailFeedback().type === 'neutral'}
          >
            {getEmailFeedback().text}
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={credentials.senha}
            onChange={handleInputChange}
            placeholder="Digite sua senha"
            required
            disabled={loading}
          />
          <span 
            className="input-feedback"
            data-valid={getSenhaFeedback().type === 'valid'}
            data-warning={getSenhaFeedback().type === 'warning'}
            data-neutral={getSenhaFeedback().type === 'neutral'}
          >
            {getSenhaFeedback().text}
          </span>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
};
