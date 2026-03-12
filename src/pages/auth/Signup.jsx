import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import InparkLogoBlack from "../../assets/inpark-logo-black.svg";
import RegisterPagePhoto from "../../assets/register-page-photo.png";
import api from "../../utils/api";
import "./Signup.css";

export const Signup = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    email: "",
    senha: "",
    confirmaSenha: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("A foto deve ter no máximo 2MB");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setError("A foto deve ser JPG ou PNG");
        return;
      }
      setProfilePhoto(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validações em tempo real
  const getNomeCompletoFeedback = () => {
    if (!formData.nome) {
      return { text: "Digite seu nome completo", type: "neutral" };
    }
    const nomes = formData.nome.trim().split(" ");
    if (nomes.length < 2 || nomes.some((n) => n.length < 2)) {
      return { text: "Digite seu nome e sobrenome", type: "warning" };
    }
    return { text: "Nome válido", type: "valid" };
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
    return { text: "Idade +18", type: "valid" };
  };

  const getEmailFeedback = () => {
    if (!formData.email) {
      return { text: "Digite seu email", type: "neutral" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { text: "Digite um email válido", type: "warning" };
    }
    return { text: "E-mail válido", type: "valid" };
  };

  const getSenhaFeedback = () => {
    if (!formData.senha) {
      return { text: "Digite sua senha", type: "neutral" };
    }
    if (formData.senha.length < 6) {
      return { text: "Senha deve ter pelo menos 6 caracteres", type: "warning" };
    }
    return { text: "Senha válida", type: "valid" };
  };

  const getConfirmaSenhaFeedback = () => {
    if (!formData.confirmaSenha) {
      return { text: "Confirme sua senha", type: "neutral" };
    }
    if (formData.confirmaSenha !== formData.senha) {
      return { text: "Senha não condiz", type: "error" };
    }
    return { text: "Senhas conferem", type: "valid" };
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

    if (formData.confirmaSenha !== formData.senha) {
      setError("As senhas não conferem");
      setLoading(false);
      return;
    }

    try {
      // Converter data para formato ISO
      const dataFormatada = new Date(formData.dataNascimento).toISOString();
      
      const payload = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        dataNascimento: dataFormatada
      };

      console.log("Enviando cadastro:", payload);

      // Cadastrar como cliente
      const response = await api.post('/cliente', payload);

      console.log("Cadastro bem-sucedido:", response);

      setSuccess("Conta criada com sucesso! Redirecionando...");
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      
      let errorMessage = "Erro ao criar conta. Tente novamente.";
      
      if (error.message.includes("409")) {
        errorMessage = "Este email já está cadastrado.";
      } else if (error.message.includes("400")) {
        errorMessage = "Dados inválidos. Verifique as informações.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left-panel">
        <img src={InparkLogoBlack} alt="Inpark Logo" className="signup-logo" />
        <div className="signup-illustration-container">
          <div className="signup-illustration">
          </div>
        </div>
      </div>

      <div className="signup-right-panel">
        <form onSubmit={handleSubmit} className="signup-form">
          <h1>Crie sua conta</h1>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Diego Genuino"
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seuemail@exemplo.com"
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
                  placeholder="************"
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
          </div>

          <div className="form-group full-width">
            <label htmlFor="confirmaSenha">Confirme sua senha</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmaSenha"
                name="confirmaSenha"
                value={formData.confirmaSenha}
                onChange={handleInputChange}
                placeholder="************"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
            <span
              className="input-feedback"
              data-valid={getConfirmaSenhaFeedback().type === "valid"}
              data-warning={getConfirmaSenhaFeedback().type === "warning"}
              data-neutral={getConfirmaSenhaFeedback().type === "neutral"}
              data-error={getConfirmaSenhaFeedback().type === "error"}
            >
              {getConfirmaSenhaFeedback().text}
            </span>
          </div>

          <div className="form-group full-width">
            <label>
              Foto de perfil <span className="optional-text">(opcional)</span>
            </label>
            <div 
              className="photo-upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png"
                onChange={handlePhotoUpload}
                disabled={loading}
              />
              <p className="upload-text">Clique para fazer o upload da sua foto</p>
              <p className="file-info">JPG ou PNG, máximo 2MB</p>
            </div>
            
            {profilePhotoPreview && (
              <div className="photo-preview-container">
                <p className="preview-label">Preview da foto</p>
                <div className="photo-preview-wrapper">
                  <img 
                    src={profilePhotoPreview} 
                    alt="Preview" 
                    className="photo-preview" 
                  />
                  <button 
                    type="button" 
                    className="remove-photo-btn"
                    onClick={handleRemovePhoto}
                  >
                    Excluir foto
                  </button>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Criando conta..." : "Concluir cadastro"}
          </button>

          <div className="login-link">
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;