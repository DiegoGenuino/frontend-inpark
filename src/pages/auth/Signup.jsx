import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import InparkLogo from "../../assets/inpark-logo.svg";
import "./Signup.css";

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    email: "",
    senha: "",
    fotoPerfil: null,
  });
  const [fotoPreview, setFotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamanho (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("A foto deve ter no máximo 2MB");
        return;
      }

      // Validar tipo
      if (!file.type.startsWith("image/")) {
        setError("Apenas arquivos de imagem são permitidos");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        fotoPerfil: file,
      }));

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  // Validações em tempo real
  const getNomeCompletoFeedback = () => {
    if (!formData.nomeCompleto) {
      return { text: "Digite seu nome completo", type: "neutral" };
    }
    const nomes = formData.nomeCompleto.trim().split(" ");
    if (nomes.length < 2 || nomes.some((n) => n.length < 2)) {
      return { text: "Digite seu nome e sobrenome", type: "warning" };
    }
    return { text: "✓ Nome válido", type: "valid" };
  };

  const getDataNascimentoFeedback = () => {
    if (!formData.dataNascimento) {
      return { text: "Digite sua data de nascimento", type: "neutral" };
    }
    const hoje = new Date();
    const nascimento = new Date(formData.dataNascimento);
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    
    if (idade < 18) {
      return { text: "Você deve ter pelo menos 18 anos", type: "error" };
    }
    if (idade > 120) {
      return { text: "Data inválida", type: "error" };
    }
    return { text: "✓ Data válida", type: "valid" };
  };

  const getEmailFeedback = () => {
    if (!formData.email) {
      return { text: "Digite seu email", type: "neutral" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { text: "Digite um email válido", type: "warning" };
    }
    return { text: "✓ Email válido", type: "valid" };
  };

  const getSenhaFeedback = () => {
    if (!formData.senha) {
      return { text: "Crie uma senha segura", type: "neutral" };
    }
    if (formData.senha.length < 6) {
      return { text: "Senha deve ter pelo menos 6 caracteres", type: "warning" };
    }
    if (formData.senha.length < 8) {
      return { text: "Senha aceitável, mas recomendamos 8+ caracteres", type: "warning" };
    }
    return { text: "✓ Senha forte", type: "valid" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validações finais
    if (getNomeCompletoFeedback().type !== "valid") {
      setError("Por favor, digite seu nome completo");
      setLoading(false);
      return;
    }

    if (getDataNascimentoFeedback().type === "error") {
      setError("Data de nascimento inválida");
      setLoading(false);
      return;
    }

    if (getEmailFeedback().type !== "valid") {
      setError("Por favor, digite um email válido");
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      // Aqui você faria a chamada para a API de cadastro
      // Por enquanto, vamos simular um cadastro bem-sucedido
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Dados do cadastro:", {
        ...formData,
        fotoPerfil: formData.fotoPerfil ? formData.fotoPerfil.name : null,
      });

      setSuccess("Conta criada com sucesso! Redirecionando...");
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <img src={InparkLogo} alt="Inpark Logo" />
      </div>

      <form onSubmit={handleSubmit} className="signup-form">
        <img
          src={InparkLogo}
          alt="Logotipo inpark"
          className="logotipo-inpark"
        />

        <h1>Criar sua conta</h1>
        <p className="subtitle">Cadastre-se no InPark para começar</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label htmlFor="nomeCompleto">Nome completo</label>
          <input
            type="text"
            id="nomeCompleto"
            name="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleInputChange}
            placeholder="Placeholder"
            required
            disabled={loading}
          />
          <span
            className="input-feedback"
            data-valid={getNomeCompletoFeedback().type === "valid"}
            data-warning={getNomeCompletoFeedback().type === "warning"}
            data-neutral={getNomeCompletoFeedback().type === "neutral"}
          >
            {getNomeCompletoFeedback().text}
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="dataNascimento">Data de nascimento</label>
          <input
            type="date"
            id="dataNascimento"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleInputChange}
            placeholder="Placeholder"
            required
            disabled={loading}
            max={new Date().toISOString().split("T")[0]}
          />
          <span
            className="input-feedback"
            data-valid={getDataNascimentoFeedback().type === "valid"}
            data-warning={getDataNascimentoFeedback().type === "warning"}
            data-neutral={getDataNascimentoFeedback().type === "neutral"}
            data-error={getDataNascimentoFeedback().type === "error"}
          >
            {getDataNascimentoFeedback().text}
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Placeholder"
            required
            disabled={loading}
          />
          <span
            className="input-feedback"
            data-valid={getEmailFeedback().type === "valid"}
            data-warning={getEmailFeedback().type === "warning"}
            data-neutral={getEmailFeedback().type === "neutral"}
          >
            {getEmailFeedback().text}
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              placeholder="Placeholder"
              required
              disabled={loading}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
          <span
            className="input-feedback"
            data-valid={getSenhaFeedback().type === "valid"}
            data-warning={getSenhaFeedback().type === "warning"}
            data-neutral={getSenhaFeedback().type === "neutral"}
          >
            {getSenhaFeedback().text}
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="fotoPerfil">Foto de perfil (opcional)</label>
          <label htmlFor="fotoPerfil" className="photo-upload-area">
            <input
              type="file"
              id="fotoPerfil"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              disabled={loading}
            />
            {fotoPreview ? (
              <img src={fotoPreview} alt="Preview" className="photo-preview" />
            ) : (
              <>
                <p className="upload-text">
                  Clique para fazer o upload da sua foto
                </p>
                <p className="file-info">JPG ou PNG, máximo 2MB</p>
              </>
            )}
          </label>
        </div>

        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta"}
        </button>

        <div className="login-link">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;