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
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decoded = decodeJWT(token);
        
        // Verificar se o token está expirado
        if (decoded && decoded.exp) {
          const now = Math.floor(Date.now() / 1000); // Timestamp em segundos
          if (decoded.exp < now) {
            console.warn('Token expirado, fazendo logout automático');
            localStorage.removeItem('token');
            setLoading(false);
            return;
          }
        }
        
        if (decoded && decoded.role) {
          setIsAuthenticated(true);
          setRole(decoded.role);
          setUser({
            email: decoded.sub,
            role: decoded.role,
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    
    const DEFAULT_EMAIL = 'demo@inpark.com';
    const DEFAULT_PASSWORD = 'demo123';
    const DONO_EMAIL = 'dono@inpark.com';
    const DONO_PASSWORD = 'dono123';
    
    try {
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Credenciais inválidas');
      }

      const loginData = await loginResponse.json();
      
      if (!loginData.token) {
        throw new Error('Token não recebido do servidor');
      }
      
      const decoded = decodeJWT(loginData.token);
      
      if (!decoded || !decoded.role) {
        throw new Error('Token inválido - role não encontrada');
      }
      
      localStorage.setItem('token', loginData.token);
      
      setIsAuthenticated(true);
      setRole(decoded.role);
      setUser({
        email: decoded.sub,
        role: decoded.role,
      });
      
      return { success: true, role: decoded.role };
    } catch (error) {
      console.error('Erro no login:', error);
      
      if (error.message.includes('Failed to fetch') || error.message === 'Network request failed') {
        if (email === DEFAULT_EMAIL && senha === DEFAULT_PASSWORD) {
          const mockToken = btoa(JSON.stringify({
            sub: DEFAULT_EMAIL,
            role: 'CLIENTE',
            name: 'Diego Genuino',
            exp: Date.now() + 86400000
          }));
          
          localStorage.setItem('token', `mock.${mockToken}`);
          
          setIsAuthenticated(true);
          setRole('CLIENTE');
          setUser({
            email: DEFAULT_EMAIL,
            role: 'CLIENTE',
            name: 'Diego Genuino'
          });
          
          return { success: true, role: 'CLIENTE', isMock: true };
        } 
        else if (email === DONO_EMAIL && senha === DONO_PASSWORD) {
          const mockToken = btoa(JSON.stringify({
            sub: DONO_EMAIL,
            role: 'DONO',
            name: 'Proprietário InPark',
            exp: Date.now() + 86400000
          }));
          
          localStorage.setItem('token', `mock.${mockToken}`);
          
          setIsAuthenticated(true);
          setRole('DONO');
          setUser({
            email: DONO_EMAIL,
            role: 'DONO',
            name: 'Proprietário InPark'
          });
          
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
