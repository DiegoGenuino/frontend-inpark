// Configuração centralizada da API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Decodifica um JWT sem verificar a assinatura (apenas para ler os dados)
 * @param {string} token - O token JWT
 * @returns {object} - Os dados decodificados do token
 */
export const decodeJWT = (token) => {
  try {
    console.log('🔓 Decodificando JWT...');
    console.log('📝 Token (primeiros 50 chars):', token.substring(0, 50) + '...');
    
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      console.error('❌ Token inválido - formato incorreto');
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
    console.log('✅ JWT decodificado com sucesso:', decoded);
    return decoded;
  } catch (error) {
    console.error('❌ Erro ao decodificar JWT:', error);
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
  console.log('🗑️ Limpando dados de autenticação...');
  
  // Remover token
  localStorage.removeItem('token');
  
  // Remover outros dados relacionados ao usuário
  localStorage.removeItem('user');
  
  console.log('✅ Dados de autenticação removidos');
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
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
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
    
    // Se não autorizado, limpar dados e redirecionar para login
    if (response.status === 401 || response.status === 403) {
      console.warn('⚠️ Acesso não autorizado - removendo token e redirecionando');
      
      // Limpar todos os dados de autenticação usando função centralizada
      clearAuthData();
      
      // Redirecionar para login
      window.location.href = '/login';
      
      throw new Error('Sessão expirada ou não autorizada');
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
    console.error('❌ Erro na requisição:', error);
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
      body: JSON.stringify(data),
    }),
  
  put: (endpoint, data, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  patch: (endpoint, data, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
