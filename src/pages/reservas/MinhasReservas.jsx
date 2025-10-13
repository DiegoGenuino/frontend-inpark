import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdSearch,
  MdLocationOn,
  MdAccessTime,
  MdDirectionsCar,
  MdAttachMoney,
  MdInfo,
  MdCancel,
  MdStar,
  MdLocalParking,
  MdFileDownload,
  MdQrCode,
  MdMoreTime,
  MdReceipt,
  MdExitToApp,
  MdCalendarToday,
} from "react-icons/md";
import { useAuth } from "../../utils/auth";
import "./MinhasReservas.css";

const MinhasReservas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [tabFilter, setTabFilter] = useState("ativas"); // 'ativas' ou 'historico'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [reservas, setReservas] = useState([
    {
      id: 1,
      estacionamento: {
        nome: "Shopping Norte",
        endereco: "Av. Norte, 987",
      },
      placaVeiculo: "GHI9J01",
      tipoVaga: "Comum",
      dataInicio: "2024-01-10T10:00:00",
      dataFim: "2024-01-10T16:00:00",
      valorTotal: 20.0,
      statusReserva: "RECUSADA",
      motivo: "Estacionamento lotado no horário solicitado",
      avaliacaoFeita: false,
    },
    {
         id: 2,
      estacionamento: {
        nome: "Shopping Norte",
        endereco: "Av. Norte, 987",
      },
      placaVeiculo: "GHI9J01",
      tipoVaga: "Comum",
      dataInicio: "2024-01-10T10:00:00",
      dataFim: "2024-02-10T16:00:00",
      valorTotal: 20.0,
      statusReserva: "ACEITA",
      motivo: "Estacionamento lotado no horário solicitado",
      avaliacaoFeita: false
    }
  ]);

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
        className: "pendente",
        color: "#FFA726",
        icon: <MdAccessTime size={16} />,
      },
      ACEITA: {
        label: "Aceita",
        className: "aceita",
        color: "#C2FE00",
        icon: <MdLocalParking size={16} />,
      },
      EM_USO: {
        label: "Em Uso",
        className: "em-uso",
        color: "#2196F3",
        icon: <MdDirectionsCar size={16} />,
      },
      ENCERRADA: {
        label: "Encerrada",
        className: "encerrada",
        color: "#4CAF50",
        icon: <MdStar size={16} />,
      },
      CANCELADA: {
        label: "Cancelada",
        className: "cancelada",
        color: "#F44336",
        icon: <MdCancel size={16} />,
      },
      RECUSADA: {
        label: "Recusada",
        className: "recusada",
        color: "#FF5722",
        icon: <MdCancel size={16} />,
      },
    };
    return statusMap[status] || statusMap["PENDENTE"];
  };

  // Filtragem das reservas
  const filteredReservas = useMemo(() => {
    let filtered = reservas;

    // Filtro por aba (ativas/historico)
    if (tabFilter === "ativas") {
      filtered = filtered.filter((reserva) =>
        ["PENDENTE", "ACEITA", "EM_USO"].includes(reserva.statusReserva)
      );
    } else {
      filtered = filtered.filter((reserva) =>
        ["ENCERRADA", "CANCELADA", "RECUSADA"].includes(reserva.statusReserva)
      );
    }

    // Filtro por busca
    if (searchTerm) {
      const termo = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (reserva) =>
          reserva.estacionamento.nome.toLowerCase().includes(termo) ||
          reserva.placaVeiculo.toLowerCase().includes(termo)
      );
    }

    return filtered;
  }, [reservas, tabFilter, searchTerm]);

  // Contadores para as abas
  const contadores = useMemo(() => {
    const ativas = reservas.filter((r) =>
      ["PENDENTE", "ACEITA", "EM_USO"].includes(r.statusReserva)
    ).length;
    const historico = reservas.filter((r) =>
      ["ENCERRADA", "CANCELADA", "RECUSADA"].includes(r.statusReserva)
    ).length;
    return { ativas, historico };
  }, [reservas]);

  // Handlers
  const handleVerDetalhes = (reserva) => {
    navigate(`/detalhes-reserva/${reserva.id}`, { state: { reserva } });
  };

  const handleCancelarReserva = (id) => {
    if (window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
      setReservas((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, statusReserva: "CANCELADA" } : r
        )
      );
    }
  };

  const handleAvaliar = (id) => {
    navigate("/avaliacao", { state: { reservaId: id } });
  };

  const handleVerQRCode = (reserva) => {
    // Implementar visualização do QR Code
    console.log("Ver QR Code para reserva:", reserva.id);
  };

  const handleEstenderTempo = (id) => {
    // Implementar extensão de tempo
    console.log("Estender tempo para reserva:", id);
  };

  const handleVerPoliticaReembolso = () => {
    // Implementar visualização da política de reembolso
    console.log("Ver política de reembolso");
  };

  const handleExportarPlanilha = () => {
    // Implementar exportação
    console.log("Exportar planilha");
  };

  if (loading) {
    return (
      <div className="minhas-reservas-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando suas reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="minhas-reservas-page">
      <div className="page-header">
        <h1>Minhas Reservas</h1>
        <p>Gerencie todas as suas reservas de estacionamento</p>
      </div>

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
                  const statusInfo = getStatusInfo(reserva.statusReserva);
                  const inicio = formatDateTime(reserva.dataInicio);
                  const fim = formatDateTime(reserva.dataFim);

                  return (
                    <tr key={reserva.id}>
                      <td>
                        <span className="reserva-id">
                          #RES{String(reserva.id).padStart(4, "0")}
                        </span>
                      </td>
                      <td>
                        <span>{reserva.estacionamento.nome}</span>
                      </td>
                      <td>
                        <div className="datetime-info">
                          <div>
                            <div>
                              {inicio.date} às {inicio.time}
                            </div>
                            <div className="data-fim">
                              {fim.date} às {fim.time}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="placa-info">
                          <span>{reserva.placaVeiculo}</span>
                        </div>
                      </td>
                      <td>
                        <div
                          className={`status-badge ${statusInfo.className}`}
                          style={{ backgroundColor: statusInfo.color }}
                        >
                          <span>{statusInfo.label}</span>
                        </div>
                      </td>
                      <td>
                        <div className="valor-info">
                          <MdAttachMoney size={16} />
                          <span>R$ {reserva.valorTotal.toFixed(2)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="acoes-cell">
                          {reserva.statusReserva === "PENDENTE" && (
                            <>
                              <button
                                className="btn-acao btn-detalhes"
                                onClick={() => handleVerDetalhes(reserva)}
                              >
                                <MdInfo />
                              </button>
                              <button
                                className="btn-acao btn-cancelar"
                                onClick={() =>
                                  handleCancelarReserva(reserva.id)
                                }
                              >
                                <MdCancel />
                              </button>
                            </>
                          )}

                          {reserva.statusReserva === "ACEITA" && (
                            <>
                              <button
                                className="btn-acao btn-qrcode"
                                onClick={() => handleVerQRCode(reserva)}
                              >
                                <MdQrCode />
                              </button>
                              <button
                                className="btn-acao btn-detalhes"
                                onClick={() => handleVerDetalhes(reserva)}
                              >
                                <MdInfo />
                              </button>
                              <button
                                className="btn-acao btn-cancelar"
                                onClick={() =>
                                  handleCancelarReserva(reserva.id)
                                }
                              >
                                <MdCancel />
                              </button>
                            </>
                          )}

                          {reserva.statusReserva === "EM_USO" && (
                            <>
                              <button
                                className="btn-acao btn-detalhes"
                                onClick={() => handleVerDetalhes(reserva)}
                              >
                                <MdInfo />
                              </button>
                              <button
                                className="btn-acao btn-estender"
                                onClick={() => handleEstenderTempo(reserva.id)}
                              >
                                <MdMoreTime />
                              </button>
                            </>
                          )}

                          {reserva.statusReserva === "ENCERRADA" && (
                            <>
                              {!reserva.avaliacaoFeita && (
                                <button
                                  className="btn-acao btn-avaliar"
                                  onClick={() => handleAvaliar(reserva.id)}
                                >
                                  <MdStar />
                                </button>
                              )}
                              <button
                                className="btn-acao btn-detalhes"
                                onClick={() => handleVerDetalhes(reserva)}
                              >
                                <MdInfo />
                              </button>
                            </>
                          )}

                          {(reserva.statusReserva === "CANCELADA" ||
                            reserva.statusReserva === "RECUSADA") && (
                            <>
                              <button
                                className="btn-acao btn-detalhes"
                                onClick={() => handleVerDetalhes(reserva)}
                              >
                                <MdInfo />
                              </button>
                              {reserva.statusReserva === "CANCELADA" && (
                                <button
                                  className="btn-acao btn-reembolso"
                                  onClick={handleVerPoliticaReembolso}
                                >
                                  <MdReceipt />
                                </button>
                              )}
                            </>
                          )}
                        </div>
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
