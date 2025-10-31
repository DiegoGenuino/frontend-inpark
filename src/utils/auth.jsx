import { createContext, useContext, useState, useEffect } from 'react';
import { decodeJWT } from './api';

// Criando o contexto
const AuthContext = createContext();

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(''); // 'CLIENTE', 'DONO', 'GERENTE'
  const [user, setUser] = useState(null); // Dados completos do usuário
  const [loading, setLoading] = useState(true);

  // Verificar se já está logado ao carregar a página
  useEffect(() => {
    console.log('🔄 Verificando autenticação ao carregar página...');
    const token = localStorage.getItem('token');
    console.log('🎫 Token encontrado no localStorage:', token ? 'SIM' : 'NÃO');
    
    if (token) {
      try {
        console.log('🔓 Tentando decodificar token...');
        // Decodificar o token para extrair a role
        const decoded = decodeJWT(token);
        console.log('📦 Token decodificado:', decoded);
        
        if (decoded && decoded.role) {
          console.log('✅ Token válido! Role:', decoded.role);
          setIsAuthenticated(true);
          setRole(decoded.role);
          
          // Criar objeto de usuário básico a partir do token
          setUser({
            email: decoded.sub, // 'sub' geralmente contém o email/username
            role: decoded.role,
          });
          console.log('✅ Autenticação restaurada com sucesso!');
        } else {
          // Token inválido
          console.warn('⚠️ Token inválido - sem role');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('❌ Erro ao recuperar dados do usuário:', error);
        localStorage.removeItem('token');
      }
    } else {
      console.log('ℹ️ Nenhum token encontrado - usuário não está logado');
    }
    setLoading(false);
    console.log('✅ Verificação de autenticação concluída');
  }, []);

  const login = async (email, senha) => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    
    console.log('🔐 Iniciando login...');
    console.log('📧 Email:', email);
    console.log('🌐 URL da API:', `${API_BASE}/auth/login`);
    
    try {
      // Fazer login no backend
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      console.log('📡 Status da resposta:', loginResponse.status);

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}));
        console.error('❌ Erro na resposta:', errorData);
        throw new Error(errorData.message || 'Credenciais inválidas');
      }

      const loginData = await loginResponse.json();
      console.log('📦 Dados recebidos do backend:', loginData);
      
      // Verificar se o token foi retornado
      if (!loginData.token) {
        console.error('❌ Token não encontrado na resposta');
        throw new Error('Token não recebido do servidor');
      }
      
      console.log('🎫 JWT Token capturado:', loginData.token);
      
      // Decodificar o JWT para extrair a role
      const decoded = decodeJWT(loginData.token);
      console.log('🔓 JWT Decodificado:', decoded);
      
      if (!decoded || !decoded.role) {
        console.error('❌ Role não encontrada no token');
        throw new Error('Token inválido - role não encontrada');
      }
      
      console.log('✅ Role do usuário:', decoded.role);
      console.log('✅ Email do token:', decoded.sub);
      
      // Salvar token
      localStorage.setItem('token', loginData.token);
      console.log('💾 Token salvo no localStorage');
      
      // Atualizar estado
      setIsAuthenticated(true);
      setRole(decoded.role);
      setUser({
        email: decoded.sub,
        role: decoded.role,
      });
      
      console.log('✅ Login concluído com sucesso!');
      return { success: true, role: decoded.role };
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return { success: false, error: error.message };
    }
  };

  // Login simplificado para testes (mantém compatibilidade)
  const loginWithRole = (roleTest) => {
    // Criar um token fake para testes
    const fakeToken = `fake-token-${roleTest}-${Date.now()}`;
    localStorage.setItem('token', fakeToken);
    
    const mockUser = {
      email: `test-${roleTest.toLowerCase()}@inpark.com`,
      role: roleTest,
    };
    
    setIsAuthenticated(true);
    setRole(roleTest);
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setRole('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      role, 
      user,
      loading,
      login, 
      loginWithRole, // Para testes rápidos
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para acessar o contexto
export const useAuth = () => useContext(AuthContext);

// Helper para obter headers de autenticação (DEPRECATED - use api.js)
export const getAuthHeaders = () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      return { Authorization: `Bearer ${token}` }
    }
  } catch (e) {
    // falha ao acessar localStorage -> ignorar
  }
  return {}
}
