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
    
    // Credenciais padrão para teste quando backend está offline
    const DEFAULT_EMAIL = 'demo@inpark.com';
    const DEFAULT_PASSWORD = 'demo123';
    const DONO_EMAIL = 'dono@inpark.com';
    const DONO_PASSWORD = 'dono123';
    
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
      
      // Verificar se é erro de rede E se está usando credenciais padrão
      if (error.message.includes('Failed to fetch') || error.message === 'Network request failed') {
        // Login como CLIENTE
        if (email === DEFAULT_EMAIL && senha === DEFAULT_PASSWORD) {
          console.log('🔌 Backend offline detectado - usando usuário CLIENTE padrão para teste');
          
          // Criar token mock
          const mockToken = btoa(JSON.stringify({
            sub: DEFAULT_EMAIL,
            role: 'CLIENTE',
            name: 'Diego Genuino',
            exp: Date.now() + 86400000 // 24 horas
          }));
          
          localStorage.setItem('token', `mock.${mockToken}`);
          
          // Atualizar estado com dados mock
          setIsAuthenticated(true);
          setRole('CLIENTE');
          setUser({
            email: DEFAULT_EMAIL,
            role: 'CLIENTE',
            name: 'Diego Genuino'
          });
          
          console.log('✅ Login mock CLIENTE concluído com sucesso!');
          return { success: true, role: 'CLIENTE', isMock: true };
        } 
        // Login como DONO
        else if (email === DONO_EMAIL && senha === DONO_PASSWORD) {
          console.log('🔌 Backend offline detectado - usando usuário DONO padrão para teste');
          
          // Criar token mock para dono
          const mockToken = btoa(JSON.stringify({
            sub: DONO_EMAIL,
            role: 'DONO',
            name: 'Proprietário InPark',
            exp: Date.now() + 86400000 // 24 horas
          }));
          
          localStorage.setItem('token', `mock.${mockToken}`);
          
          // Atualizar estado com dados mock
          setIsAuthenticated(true);
          setRole('DONO');
          setUser({
            email: DONO_EMAIL,
            role: 'DONO',
            name: 'Proprietário InPark'
          });
          
          console.log('✅ Login mock DONO concluído com sucesso!');
          return { success: true, role: 'DONO', isMock: true };
        } 
        else {
          return { 
            success: false, 
            error: 'Backend offline. Use as credenciais padrão para testar:\nCliente: demo@inpark.com / demo123\nDono: dono@inpark.com / dono123' 
          };
        }
      }
      
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
    console.log('🚪 Iniciando logout...');
    
    // Remover token do localStorage
    localStorage.removeItem('token');
    console.log('🗑️ Token removido do localStorage');
    
    // Limpar outros dados que possam existir (opcional)
    // localStorage.removeItem('user');
    // sessionStorage.clear();
    
    // Resetar estados da autenticação
    setIsAuthenticated(false);
    setRole('');
    setUser(null);
    
    console.log('✅ Logout concluído - usuário desautenticado');
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
