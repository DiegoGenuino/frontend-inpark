import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdAttachMoney,
  MdLocalParking,
  MdStar,
} from "react-icons/md";
import { Header } from '../../components/shared';
import { useAuth } from "../../utils/auth";
import { reservaService, usuarioService } from "../../utils/services";
import "./MinhasReservas.css";

const MinhasReservas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [tabFilter, setTabFilter] = useState("ativas"); // 'ativas' ou 'historico'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reservas, setReservas] = useState([]);

  // Buscar reservas do backend ao montar o componente
  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      setError("");
      try {
        // 1. Buscar dados do usuário logado
        const userData = await usuarioService.getMe();
        const clienteId = userData?.id;
        
        if (!clienteId) {
          throw new Error('Não foi possível identificar o usuário');
        }
        
        // 2. Buscar todas as reservas e filtrar pelo ID do cliente
        const minhasReservas = await reservaService.getMinhasReservas(clienteId);
        setReservas(minhasReservas);
      } catch (e) {
        console.error('Erro ao carregar reservas:', e);
        setError(e.message || 'Erro ao carregar reservas');
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  // Função para formatar data e hora
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}`,
    };
  };

  // Função para obter informações do status
  const getStatusInfo = (status) => {
    const statusMap = {
      PENDENTE: {
        label: "Pendente",
        className: "status-pendente",
      },
      ACEITA: {
        label: "Aceita",
        className: "status-aceita",
      },
      EM_USO: {
        label: "Em Uso",
        className: "status-em-uso",
      },
      ENCERRADA: {
        label: "Encerrada",
        className: "status-encerrada",
      },
      CANCELADA: {
        label: "Cancelada",
        className: "status-cancelada",
      },
      RECUSADA: {
        label: "Recusada",
        className: "status-recusada",
      },
    };
    return statusMap[status] || statusMap["PENDENTE"];
  };

  // Filtragem das reservas
  const filteredReservas = useMemo(() => {
    let filtered = reservas;

    // Filtro por aba (ativas/historico)
    if (tabFilter === "ativas") {
      filtered = filtered.filter((reserva) => {
        const status = (reserva.statusReserva || reserva.status || '').toUpperCase();
        return ["PENDENTE", "ACEITA", "EM_USO"].includes(status);
      });
    } else {
      filtered = filtered.filter((reserva) => {
        const status = (reserva.statusReserva || reserva.status || '').toUpperCase();
        return ["ENCERRADA", "CANCELADA", "RECUSADA"].includes(status);
      });
    }

    // Filtro por busca
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (reserva) => {
          const nomeEstacionamento = reserva.estacionamento?.nome || reserva.estacionamentoNome || '';
          const placa = reserva.placaVeiculo || reserva.veiculo?.placa || '';
          return nomeEstacionamento.toLowerCase().includes(termo) ||
                 placa.toLowerCase().includes(termo);
        }
      );
    }

    return filtered;
  }, [reservas, tabFilter, searchTerm]);

  // Contadores para as abas
  const contadores = useMemo(() => {
    const ativas = reservas.filter((r) => {
      const status = (r.statusReserva || r.status || '').toUpperCase();
      return ["PENDENTE", "ACEITA", "EM_USO"].includes(status);
    }).length;
    const historico = reservas.filter((r) => {
      const status = (r.statusReserva || r.status || '').toUpperCase();
      return ["ENCERRADA", "CANCELADA", "RECUSADA"].includes(status);
    }).length;
    return { ativas, historico };
  }, [reservas]);

  return (
    <div className="minhas-reservas-page">
      <Header 
        title="Minhas Reservas"
        subtitle="Gerencie todas as suas reservas de estacionamento"
      />

      {error && <div className="error-container">{error}</div>}

      {/* Navegação e Filtros */}
      <div className="filtros-section">
        {/* Abas/Filtros */}
        <div className="abas-filtros">
          <button
            className={`aba-btn ${tabFilter === "ativas" ? "active" : ""}`}
            onClick={() => setTabFilter("ativas")}
          >
            Ativas/Pendentes ({contadores.ativas})
          </button>
          <button
            className={`aba-btn ${tabFilter === "historico" ? "active" : ""}`}
            onClick={() => setTabFilter("historico")}
          >
            Histórico ({contadores.historico})
          </button>
        </div>

        {/* Barra de Busca */}
        <div className="busca-container">
          <div className="busca-bar">
            <MdSearch className="busca-icon" />
            <input
              type="text"
              placeholder="Buscar por Nome do Estacionamento ou Placa do Veículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="busca-input"
            />
          </div>
        </div>

        <div className="resultados-count">
          {filteredReservas.length} reserva
          {filteredReservas.length !== 1 ? "s" : ""} encontrada
          {filteredReservas.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Lista de Reservas */}
      <div className="reservas-container">
        {filteredReservas.length === 0 ? (
          <div className="no-results">
            <MdLocalParking size={64} />
            <h3>Nenhuma reserva encontrada</h3>
            <p>
              {searchTerm
                ? "Tente ajustar os termos de busca."
                : tabFilter === "ativas"
                ? "Você não possui reservas ativas no momento."
                : "Você ainda não possui histórico de reservas."}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="reservas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estacionamento</th>
                  <th>Data/Hora</th>
                  <th>Placa</th>
                  <th>Status</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservas.map((reserva) => {
                  console.log('Reserva completa:', reserva);
                  
                  const status = reserva.statusReserva || reserva.status || 'PENDENTE';
                  const statusInfo = getStatusInfo(status);
                  
                  // Formato backend pode ser dataDaReserva + horaDaReserva, ou dataInicio/dataFim
                  let dataInicio = reserva.dataInicio;
                  
                  // Se não tem dataInicio, tentar construir a partir de dataDaReserva
                  if (!dataInicio && reserva.dataDaReserva) {
                    // Se dataDaReserva já é uma string ISO ou similar
                    if (typeof reserva.dataDaReserva === 'string') {
                      dataInicio = reserva.dataDaReserva;
                      // Se tem horaDaReserva e dataDaReserva não inclui hora
                      if (reserva.horaDaReserva && !reserva.dataDaReserva.includes('T')) {
                        dataInicio = `${reserva.dataDaReserva}T${reserva.horaDaReserva}`;
                      }
                    } else if (Array.isArray(reserva.dataDaReserva)) {
                      // Se for array [2024, 12, 1, 14, 30, 0]
                      const [year, month, day, hour = 0, minute = 0, second = 0] = reserva.dataDaReserva;
                      dataInicio = new Date(year, month - 1, day, hour, minute, second).toISOString();
                    }
                  }
                  
                  let dataFim = reserva.dataFim;
                  if (!dataFim && reserva.dataFinal) {
                    if (typeof reserva.dataFinal === 'string') {
                      dataFim = reserva.dataFinal;
                    } else if (Array.isArray(reserva.dataFinal)) {
                      const [year, month, day, hour = 0, minute = 0, second = 0] = reserva.dataFinal;
                      dataFim = new Date(year, month - 1, day, hour, minute, second).toISOString();
                    }
                  }
                  
                  if (!dataFim) {
                    dataFim = dataInicio;
                  }
                  
                  console.log('Data Inicio processada:', dataInicio);
                  console.log('Data Fim processada:', dataFim);
                  
                  const inicio = formatDateTime(dataInicio);
                  const fim = formatDateTime(dataFim);
                  
                  const nomeEstacionamento = reserva.estacionamento?.nome || reserva.estacionamentoNome || '—';
                  
                  // Melhorar extração de placa
                  let placa = reserva.placaVeiculo || reserva.placa;
                  if (!placa && reserva.veiculo) {
                    placa = reserva.veiculo.placa || reserva.veiculo.placaVeiculo;
                  }
                  if (!placa && reserva.carro) {
                    placa = reserva.carro.placa || reserva.carro.placaVeiculo;
                  }
                  placa = placa || '—';
                  
                  console.log('Placa extraída:', placa);
                  
                  const valor = reserva.valorTotal ?? reserva.valor ?? 0;

                  return (
                    <tr key={reserva.id}>
                      <td>
                        <span className="reserva-id">
                          #RES{String(reserva.id).padStart(4, "0")}
                        </span>
                      </td>
                      <td>
                        <span>{nomeEstacionamento}</span>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <div>
                            <div>
                              {inicio.date} às {inicio.time}
                            </div>
                            {dataInicio !== dataFim && (
                              <div className="data-fim">
                                {fim.date} às {fim.time}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="placa-info">
                          <span>{placa}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-text ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <div className="valor-info">
                          <MdAttachMoney size={16} />
                          <span>R$ {Number(valor).toFixed(2)}</span>
                        </div>
                      </td>
                      <td>
                        {['ACEITA', 'ENCERRADA', 'EM_USO'].includes(status) && (
                          <button
                            className="btn-avaliar"
                            onClick={() => navigate(`/avaliacao/${reserva.id}`)}
                            title="Avaliar estacionamento"
                          >
                            <MdStar size={18} />
                            Avaliar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinhasReservas;
