// Exemplo de serviço para gerenciar estacionamentos

import api from './api';

/**
 * Serviço de Estacionamentos
 * Contém todas as funções relacionadas a estacionamentos
 */
export const estacionamentoService = {
  /**
   * Buscar todos os estacionamentos
   */
  getAll: async () => {
    return await api.get('/estacionamento');
  },

  /**
   * Buscar estacionamento por ID
   */
  getById: async (id) => {
    return await api.get(`/estacionamento/${id}`);
  },

  /**
   * Criar novo estacionamento (DONO/GERENTE)
   */
  create: async (data) => {
    return await api.post('/estacionamento', data);
  },

  /**
   * Atualizar estacionamento (DONO/GERENTE)
   */
  update: async (id, data) => {
    return await api.put(`/estacionamento/${id}`, data);
  },

  /**
   * Deletar estacionamento (DONO)
   */
  delete: async (id) => {
    return await api.delete(`/estacionamento/${id}`);
  },
};

/**
 * Serviço de Reservas
 */
export const reservaService = {
  /**
   * Buscar minhas reservas (CLIENTE)
   * Workaround: busca todas e filtra por clienteId no frontend
   */
  getMinhasReservas: async (clienteId) => {
    const todasReservas = await api.get('/reserva');
    const lista = Array.isArray(todasReservas) ? todasReservas : (todasReservas.content || []);
    
    // Se foi passado clienteId, filtrar
    if (clienteId) {
      return lista.filter(r => r.cliente?.id === clienteId);
    }
    
    return lista;
  },

  /**
   * Buscar reserva por ID
   */
  getById: async (id) => {
    return await api.get(`/reservas/${id}`);
  },

  /**
   * Criar nova reserva
   */
  create: async (data) => {
    return await api.post('/reservas', data);
  },

  /**
   * Cancelar reserva
   */
  cancel: async (id) => {
    return await api.delete(`/reservas/${id}`);
  },
};

/**
 * Serviço de Carros
 */
export const carroService = {
  /**
   * Buscar meus carros
   */
  getMeusCarros: async () => {
    return await api.get('/carros/meus-carros');
  },

  /**
   * Adicionar novo carro
   */
  create: async (data) => {
    return await api.post('/carros', data);
  },

  /**
   * Atualizar carro
   */
  update: async (id, data) => {
    return await api.put(`/carros/${id}`, data);
  },

  /**
   * Deletar carro
   */
  delete: async (id) => {
    return await api.delete(`/carros/${id}`);
  },
};

/**
 * Serviço de Usuário
 */
export const usuarioService = {
  /**
   * Buscar dados do usuário logado
   * Como o JWT só tem email, precisamos buscar o cliente pelo email
   */
  getMe: async () => {
    // Decodificar token para pegar o email
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }
    
    // Importar decodeJWT localmente para evitar circular dependency
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    const email = decoded.sub;
    
    // Buscar cliente por email via GET /cliente
    // Como não temos endpoint /cliente/email/{email}, vamos buscar todos e filtrar
    const todosClientes = await api.get('/cliente');
    const lista = Array.isArray(todosClientes) ? todosClientes : (todosClientes.content || []);
    const cliente = lista.find(c => c.email === email);
    
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }
    
    return cliente;
  },

  /**
   * Atualizar perfil
   */
  updateProfile: async (data) => {
    return await api.put('/usuario/me', data);
  },

  /**
   * Atualizar senha
   */
  updatePassword: async (data) => {
    return await api.put('/usuario/senha', data);
  },
};

/**
 * Serviço de Pagamentos
 */
export const pagamentoService = {
  /**
   * Criar pagamento
   */
  create: async (data) => {
    return await api.post('/pagamentos', data);
  },

  /**
   * Buscar pagamentos
   */
  getAll: async () => {
    return await api.get('/pagamentos');
  },

  /**
   * Confirmar pagamento
   */
  confirm: async (id) => {
    return await api.post(`/pagamentos/${id}/confirmar`);
  },
};

/**
 * Serviço de Avaliações
 */
export const avaliacaoService = {
  /**
   * Criar avaliação
   */
  create: async (data) => {
    return await api.post('/avaliacoes', data);
  },

  /**
   * Buscar avaliações de um estacionamento
   */
  getByEstacionamento: async (estacionamentoId) => {
    return await api.get(`/avaliacoes/estacionamento/${estacionamentoId}`);
  },
};

/**
 * Serviço de Valores (precificação)
 * Endpoints oficiais (Swagger): /valor
 */
export const valorService = {
  getAll: async () => api.get('/valor'),
  getById: async (id) => api.get(`/valor/${id}`),
  create: async (data) => api.post('/valor', data),
  update: async (id, data) => api.put(`/valor/${id}`, data),
  delete: async (id) => api.delete(`/valor/${id}`),
};

/**
 * Helper: normaliza horaDaReserva para formato HH:mm:ss
 */
const normalizeTimeFormat = (time) => {
  if (!time) return '';
  // Se já tem formato HH:mm:ss, retorna como está
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
  // Se tem formato HH:mm, adiciona :00
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
  // Caso contrário, retorna como está (backend vai validar)
  return time;
};

/**
 * Serviço do Dono (Proprietário)
 * Endpoints podem variar conforme o backend; tentamos caminhos comuns.
 */
export const donoService = {
  /**
   * Buscar estacionamentos do dono logado
   */
  getMeusEstacionamentos: async () => {
    // Endpoints oficiais (Swagger): GET /estacionamento
    // Obs.: Caso o backend aceite filtros (ex.: ?donoId=), poderemos passar aqui depois
    return await api.get('/estacionamento');
  },

  /**
   * Buscar reservas dos estacionamentos do dono (com filtro opcional de status)
   */
  getReservas: async () => {
    // Endpoints oficiais (Swagger): GET /reserva (sem query params)
    return await api.get('/reserva');
  },

  /**
   * Aprovar uma reserva
   */
  aprovarReserva: async (id, reservaData = null) => {
    // PUT /reserva/{id} exige corpo completo: { clienteId, estacioId, dataDaReserva, horaDaReserva, statusReserva }
    let current = reservaData;
    
    // Se não passou os dados, buscar do backend (pode dar 403 se não tiver permissão)
    if (!current) {
      current = await api.get(`/reserva/${id}`);
    }
    
    if (!current || current.id === undefined) {
      throw new Error('Reserva não encontrada para aprovação');
    }
    
    const payload = {
      clienteId: current?.cliente?.id ?? 0,
      estacioId: current?.estacionamento?.id ?? 0,
      dataDaReserva: current?.dataDaReserva || '',
      horaDaReserva: normalizeTimeFormat(current?.horaDaReserva || ''),
      statusReserva: 'ACEITA',
    };
    
    return await api.put(`/reserva/${id}`, payload);
  },

  /**
   * Rejeitar uma reserva com motivo opcional
   */
  rejeitarReserva: async (id, reservaData = null) => {
    // PUT /reserva/{id} exige corpo completo
    let current = reservaData;
    
    // Se não passou os dados, buscar do backend (pode dar 403 se não tiver permissão)
    if (!current) {
      current = await api.get(`/reserva/${id}`);
    }
    
    if (!current || current.id === undefined) {
      throw new Error('Reserva não encontrada para recusa');
    }
    
    const payload = {
      clienteId: current?.cliente?.id ?? 0,
      estacioId: current?.estacionamento?.id ?? 0,
      dataDaReserva: current?.dataDaReserva || '',
      horaDaReserva: normalizeTimeFormat(current?.horaDaReserva || ''),
      statusReserva: 'RECUSADA',
    };
    
    return await api.put(`/reserva/${id}`, payload);
  },
};

// Exportar todos os serviços
export default {
  estacionamento: estacionamentoService,
  reserva: reservaService,
  carro: carroService,
  usuario: usuarioService,
  pagamento: pagamentoService,
  avaliacao: avaliacaoService,
  valor: valorService,
  dono: donoService,
};
