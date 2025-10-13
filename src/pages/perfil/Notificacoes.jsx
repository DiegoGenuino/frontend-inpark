import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdNotifications, 
  MdNotificationsActive, 
  MdDoneAll, 
  MdFilterList,
  MdCheckCircle,
  MdError,
  MdInfo,
  MdLocalOffer,
  MdAccessTime,
  MdExpandMore,
  MdExpandLess,
  MdMarkAsUnread,
  MdMarkEmailRead
} from 'react-icons/md';
import './Notificacoes.css';

const Notificacoes = () => {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [notificacoesFiltradas, setNotificacoesFiltradas] = useState([]);
  const [expandedNotification, setExpandedNotification] = useState(null);

  // Categorias disponíveis
  const categorias = [
    { value: 'todas', label: 'Todas', icon: MdNotifications },
    { value: 'reservas', label: 'Reservas', icon: MdCheckCircle },
    { value: 'pagamentos', label: 'Pagamentos', icon: MdInfo },
    { value: 'promocoes', label: 'Promoções', icon: MdLocalOffer },
    { value: 'sistema', label: 'Sistema', icon: MdError }
  ];

  useEffect(() => {
    // Simular dados de notificações
    const mockNotificacoes = [
      {
        id: 1,
        titulo: 'Reserva Confirmada',
        corpo: 'Sua reserva no Estacionamento Shopping Center Norte para hoje às 14:30 foi confirmada. Utilize o QR Code para acesso.',
        categoria: 'reservas',
        tipo: 'sucesso',
        dataHora: '2025-10-08T14:30:00Z',
        lida: false,
        reservaId: 1,
        icon: MdCheckCircle
      },
      {
        id: 2,
        titulo: 'Pagamento Recebido',
        corpo: 'Pagamento de R$ 25,50 referente à reserva #RES0001 foi processado com sucesso via PIX.',
        categoria: 'pagamentos',
        tipo: 'sucesso',
        dataHora: '2025-10-08T13:45:00Z',
        lida: false,
        reservaId: 1,
        icon: MdCheckCircle
      },
      {
        id: 3,
        titulo: 'Promoção Especial',
        corpo: 'Aproveite! 20% de desconto em reservas durante a semana. Use o código SEMANA20 até domingo.',
        categoria: 'promocoes',
        tipo: 'info',
        dataHora: '2025-10-08T09:00:00Z',
        lida: true,
        icon: MdLocalOffer
      },
      {
        id: 4,
        titulo: 'Reserva Iniciada',
        corpo: 'Você chegou ao estacionamento! Sua reserva está ativa. Lembre-se que o tempo limite é 18:30.',
        categoria: 'reservas',
        tipo: 'info',
        dataHora: '2025-10-08T14:35:00Z',
        lida: false,
        reservaId: 2,
        icon: MdAccessTime
      },
      {
        id: 5,
        titulo: 'Falha no Pagamento',
        corpo: 'Não foi possível processar o pagamento da reserva #RES0003. Tente novamente ou escolha outro método.',
        categoria: 'pagamentos',
        tipo: 'erro',
        dataHora: '2025-10-07T16:20:00Z',
        lida: true,
        reservaId: 3,
        icon: MdError
      },
      {
        id: 6,
        titulo: 'Reserva Recusada',
        corpo: 'Sua solicitação de reserva para o Estacionamento Vila Madalena foi recusada devido à lotação.',
        categoria: 'reservas',
        tipo: 'erro',
        dataHora: '2025-10-07T11:15:00Z',
        lida: true,
        reservaId: 4,
        icon: MdError
      },
      {
        id: 7,
        titulo: 'Lembrete de Avaliação',
        corpo: 'Que tal avaliar sua experiência no Estacionamento Central? Sua opinião é muito importante para nós!',
        categoria: 'sistema',
        tipo: 'info',
        dataHora: '2025-10-06T20:00:00Z',
        lida: true,
        reservaId: 5,
        icon: MdInfo
      },
      {
        id: 8,
        titulo: 'Bem-vindo ao InPark!',
        corpo: 'Parabéns! Sua conta foi criada com sucesso. Comece agora mesmo a encontrar vagas de estacionamento.',
        categoria: 'sistema',
        tipo: 'sucesso',
        dataHora: '2025-10-05T10:30:00Z',
        lida: true,
        icon: MdCheckCircle
      }
    ];

    // Ordenar por data (mais recente primeiro)
    const ordenadas = mockNotificacoes.sort((a, b) => 
      new Date(b.dataHora) - new Date(a.dataHora)
    );

    setNotificacoes(ordenadas);
  }, []);

  // Filtrar notificações
  useEffect(() => {
    let filtradas = notificacoes;

    // Filtro por categoria
    if (filtroCategoria !== 'todas') {
      filtradas = filtradas.filter(notif => notif.categoria === filtroCategoria);
    }

    // Filtro por status de leitura
    if (filtroStatus === 'nao-lidas') {
      filtradas = filtradas.filter(notif => !notif.lida);
    } else if (filtroStatus === 'lidas') {
      filtradas = filtradas.filter(notif => notif.lida);
    }

    setNotificacoesFiltradas(filtradas);
  }, [notificacoes, filtroCategoria, filtroStatus]);

  // Formatação de data e hora
  const formatarDataHora = (dataHora) => {
    const data = new Date(dataHora);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(hoje.getDate() - 1);

    const ehHoje = data.toDateString() === hoje.toDateString();
    const ehOntem = data.toDateString() === ontem.toDateString();

    const hora = data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    if (ehHoje) {
      return `Hoje às ${hora}`;
    } else if (ehOntem) {
      return `Ontem às ${hora}`;
    } else {
      const dataFormatada = data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${dataFormatada} às ${hora}`;
    }
  };

  // Obter configuração de estilo por tipo
  const obterEstiloTipo = (tipo) => {
    switch (tipo) {
      case 'sucesso':
        return { cor: '#10b981', background: '#f0fdf4' };
      case 'erro':
        return { cor: '#ef4444', background: '#fef2f2' };
      case 'info':
        return { cor: '#3b82f6', background: '#f0f9ff' };
      default:
        return { cor: '#6b7280', background: '#f9fafb' };
    }
  };

  // Handlers
  const handleMarcarTodasComoLidas = () => {
    setNotificacoes(prev => prev.map(notif => ({ ...notif, lida: true })));
  };

  const handleToggleNotificacao = (id) => {
    setNotificacoes(prev => prev.map(notif => 
      notif.id === id ? { ...notif, lida: !notif.lida } : notif
    ));
  };

  const handleExpandNotificacao = (id) => {
    setExpandedNotification(expandedNotification === id ? null : id);
  };

  const handleClickNotificacao = (notificacao) => {
    // Marcar como lida se não estiver
    if (!notificacao.lida) {
      handleToggleNotificacao(notificacao.id);
    }

    // Navegar para tela relacionada
    switch (notificacao.categoria) {
      case 'reservas':
        if (notificacao.reservaId) {
          navigate('/minhas-reservas');
        }
        break;
      case 'pagamentos':
        if (notificacao.reservaId) {
          navigate('/minhas-reservas');
        }
        break;
      case 'promocoes':
        navigate('/estacionamentos');
        break;
      default:
        // Para notificações do sistema, apenas expandir
        handleExpandNotificacao(notificacao.id);
        break;
    }
  };

  // Contadores
  const contadores = {
    total: notificacoes.length,
    naoLidas: notificacoes.filter(n => !n.lida).length,
    lidas: notificacoes.filter(n => n.lida).length
  };

  return (
    <div className="notificacoes-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Notificações</h1>
          <p>Acompanhe todas as atualizações e comunicações importantes</p>
        </div>
        
        {contadores.naoLidas > 0 && (
          <button className="btn-marcar-todas" onClick={handleMarcarTodasComoLidas}>
            <MdDoneAll />
            Marcar Todas como Lidas ({contadores.naoLidas})
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="filtros-section">
        <div className="filtros-header">
          <MdFilterList />
          <span>Filtros</span>
        </div>

        <div className="filtros-content">
          {/* Filtro por categoria */}
          <div className="filtro-group">
            <label>Categoria:</label>
            <div className="filtro-buttons">
              {categorias.map(categoria => (
                <button
                  key={categoria.value}
                  className={`filtro-btn ${filtroCategoria === categoria.value ? 'active' : ''}`}
                  onClick={() => setFiltroCategoria(categoria.value)}
                >
                  <categoria.icon />
                  {categoria.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por status */}
          <div className="filtro-group">
            <label>Status:</label>
            <div className="filtro-buttons">
              <button
                className={`filtro-btn ${filtroStatus === 'todas' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('todas')}
              >
                Todas ({contadores.total})
              </button>
              <button
                className={`filtro-btn ${filtroStatus === 'nao-lidas' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('nao-lidas')}
              >
                Não Lidas ({contadores.naoLidas})
              </button>
              <button
                className={`filtro-btn ${filtroStatus === 'lidas' ? 'active' : ''}`}
                onClick={() => setFiltroStatus('lidas')}
              >
                Lidas ({contadores.lidas})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="notificacoes-lista">
        {notificacoesFiltradas.length === 0 ? (
          <div className="lista-vazia">
            <MdNotifications size={64} />
            <h3>Nenhuma notificação encontrada</h3>
            <p>
              {filtroCategoria !== 'todas' || filtroStatus !== 'todas'
                ? 'Tente ajustar os filtros para ver mais notificações.'
                : 'Você está em dia! Não há notificações pendentes.'
              }
            </p>
          </div>
        ) : (
          notificacoesFiltradas.map(notificacao => {
            const IconeNotificacao = notificacao.icon;
            const estilo = obterEstiloTipo(notificacao.tipo);
            const expandida = expandedNotification === notificacao.id;

            return (
              <div
                key={notificacao.id}
                className={`notificacao-item ${!notificacao.lida ? 'nao-lida' : ''} ${expandida ? 'expandida' : ''}`}
              >
                <div className="notificacao-header" onClick={() => handleClickNotificacao(notificacao)}>
                  {/* Indicador de não lida */}
                  {!notificacao.lida && <div className="indicador-nao-lida"></div>}

                  {/* Ícone */}
                  <div className="notificacao-icone" style={{ backgroundColor: estilo.background }}>
                    <IconeNotificacao style={{ color: estilo.cor }} />
                  </div>

                  {/* Conteúdo */}
                  <div className="notificacao-conteudo">
                    <div className="notificacao-titulo">
                      {notificacao.titulo}
                      {!notificacao.lida && <MdNotificationsActive className="icone-nova" />}
                    </div>
                    <div className="notificacao-preview">
                      {notificacao.corpo.length > 100 
                        ? `${notificacao.corpo.substring(0, 100)}...`
                        : notificacao.corpo
                      }
                    </div>
                    <div className="notificacao-meta">
                      <span className="data-hora">{formatarDataHora(notificacao.dataHora)}</span>
                      <span className={`categoria-tag ${notificacao.categoria}`}>
                        {categorias.find(c => c.value === notificacao.categoria)?.label}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="notificacao-acoes">
                    <button
                      className="btn-toggle-leitura"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleNotificacao(notificacao.id);
                      }}
                      title={notificacao.lida ? 'Marcar como não lida' : 'Marcar como lida'}
                    >
                      {notificacao.lida ? <MdMarkAsUnread /> : <MdMarkEmailRead />}
                    </button>
                    
                    {notificacao.corpo.length > 100 && (
                      <button
                        className="btn-expandir"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExpandNotificacao(notificacao.id);
                        }}
                      >
                        {expandida ? <MdExpandLess /> : <MdExpandMore />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Conteúdo expandido */}
                {expandida && (
                  <div className="notificacao-corpo-completo">
                    <p>{notificacao.corpo}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Resumo */}
      {notificacoesFiltradas.length > 0 && (
        <div className="notificacoes-resumo">
          <p>
            Exibindo {notificacoesFiltradas.length} de {contadores.total} notificações
            {contadores.naoLidas > 0 && ` • ${contadores.naoLidas} não lidas`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Notificacoes;