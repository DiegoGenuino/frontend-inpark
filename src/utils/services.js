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
   */
  getMinhasReservas: async () => {
    return await api.get('/reservas/minhas-reservas');
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
   */
  getMe: async () => {
    return await api.get('/usuario/me');
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

// Exportar todos os serviços
export default {
  estacionamento: estacionamentoService,
  reserva: reservaService,
  carro: carroService,
  usuario: usuarioService,
  pagamento: pagamentoService,
  avaliacao: avaliacaoService,
};
