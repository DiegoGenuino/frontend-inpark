import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/auth";
import InparkLogo from "../../assets/inpark-logo.svg";
import "./Login.css";

export const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    senha: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login, role } = useAuth();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'DONO') {
        navigate('/dono');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, role, navigate]);

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
      // Fazer login com o backend
      const result = await login(credentials.email, credentials.senha);

      if (!result.success) {
        setError(result.error || "Email ou senha incorretos");
      } else {
        // Login bem-sucedido - redirecionar baseado no role
        if (result.role === 'DONO') {
          navigate('/dono');
        } else {
          navigate('/');
        }
      }
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

        <div className="signup-link">
          Ainda não tem conta? <Link to="/signup">Cadastre-se!</Link>
        </div>
      </form>
    </div>
  );
};
