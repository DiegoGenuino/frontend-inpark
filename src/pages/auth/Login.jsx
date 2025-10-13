import React, { useState } from "react";
import { useAuth } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import InparkLogo from "../../assets/inpark-logo.svg";
import "./Login.css";

export const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    senha: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login, loginWithRole } = useAuth();

  // Se já estiver autenticado, redireciona para dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Tentar login real com o backend
      const result = await login(credentials.email, credentials.senha);

      if (!result.success) {
        // Se falhar, tentar com usuários pré-definidos para teste
        const users = {
          "admin@inpark.com": { senha: "123456", role: "DONO" },
          "gerente@inpark.com": { senha: "123456", role: "GERENTE" },
          "usuario@inpark.com": { senha: "123456", role: "CLIENTE" },
        };

        const user = users[credentials.email];

        if (user && user.senha === credentials.senha) {
          // Login com dados mock
          localStorage.setItem("token", "fake-jwt-token-" + user.role);
          loginWithRole(user.role);
        } else {
          setError(result.error || "Email ou senha incorretos");
        }
      }
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para preencher formulário rapidamente
  const quickLogin = (userType) => {
    const quickUsers = {
      admin: { email: "admin@inpark.com", senha: "123456" },
      gerente: { email: "gerente@inpark.com", senha: "123456" },
      cliente: { email: "usuario@inpark.com", senha: "123456" },
    };

    setCredentials(quickUsers[userType]);
    setError("");
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

  if (loading) {
    return (
      <div className="login-container">
        <div className="loading-spinner">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

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
