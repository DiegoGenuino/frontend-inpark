// Configuração centralizada da API

// Em desenvolvimento, usa '' (vazio) para aproveitar o proxy do Vite
// Em produção, deve usar a URL completa do backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Decodifica um JWT sem verificar a assinatura (apenas para ler os dados)
 * @param {string} token - O token JWT
 * @returns {object} - Os dados decodificados do token
 */
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      console.error('Token inválido - formato incorreto');
      return null;
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const decoded = JSON.parse(jsonPayload);
    return decoded;
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
};

/**
 * Obtém o token do localStorage
 * @returns {string|null} - O token JWT ou null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Remove o token e dados do usuário, fazendo logout completo
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Verifica se o token existe e está válido
 * @returns {boolean} - True se o token existe
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

/**
 * Obtém os headers de autenticação
 * @returns {object} - Headers com o token de autenticação
 */
export const getAuthHeaders = () => {
  const token = getToken();
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
    };
  }
  return {};
};

/**
 * Função helper para fazer requisições à API
 * @param {string} endpoint - O endpoint da API (sem a URL base)
 * @param {object} options - Opções do fetch
 * @returns {Promise} - Promise com a resposta da API
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Tratamento de autenticação/autorização
    if (response.status === 401) {
      // 401: token inválido/expirado -> limpar sessão e redirecionar
      console.warn('Sessão expirada ou não autenticado (401)');
      clearAuthData();
      window.location.href = '/';
      throw new Error('Sessão expirada. Faça login novamente.');
    }
    if (response.status === 403) {
      // 403: proibido (sem permissão). Não deve forçar logout/redirecionar.
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.message || 'Acesso negado (403)';
      throw new Error(message);
    }

    // Se não for OK, lançar erro
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro ${response.status}`);
    }

    // Tentar parsear JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};

/**
 * Métodos HTTP
 */
export const api = {
  get: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    }),
  
  put: (endpoint, data, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    }),
  
  patch: (endpoint, data, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    }),
  
  delete: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
