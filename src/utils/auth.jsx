import { createContext, useContext, useState, useEffect } from 'react';

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
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setRole(parsedUser.tipoDeUsuario);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    const API_BASE = import.meta.env.VITE_API_URL || '';
    
    try {
      // 1. Fazer login
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!loginResponse.ok) {
        throw new Error('Credenciais inválidas');
      }

      const loginData = await loginResponse.json();
      
      // Salvar token
      localStorage.setItem('token', loginData.token);

      // 2. Buscar dados completos do usuário
      const userResponse = await fetch(`${API_BASE}/usuario/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        
        // Salvar dados do usuário
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Atualizar estado
        setIsAuthenticated(true);
        setRole(userData.tipoDeUsuario);
        setUser(userData);
        
        return { success: true };
      } else {
        throw new Error('Erro ao buscar dados do usuário');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message };
    }
  };

  // Login simplificado para testes (mantém compatibilidade)
  const loginWithRole = (roleTest) => {
    const mockUser = {
      id: 1,
      nome: 'Diego Genuino',
      email: 'diego@inpark.com',
      tipoDeUsuario: roleTest,
      status: true
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsAuthenticated(true);
    setRole(roleTest);
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

// Helper para obter headers de autenticação (se existir um token em localStorage)
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
