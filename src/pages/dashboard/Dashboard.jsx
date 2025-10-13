import React, { useEffect, useState, useMemo } from 'react';
import { useAuth, getAuthHeaders } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { MdSearch, MdLocationOn, MdAccessTime, MdDirectionsCar, MdMyLocation, MdChevronRight, MdPerson, MdNotifications, MdLocalParking, MdCalendarToday, MdTrendingUp } from 'react-icons/md';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [estacionamentosProximos, setEstacionamentosProximos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Dados do gráfico
    const gastosData = useMemo(() => ({
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
            {
                label: 'Gastos com Estacionamento',
                data: [120, 150, 180, 140, 200, 160, 190, 220, 180, 240, 210, 250],
                fill: true,
                backgroundColor: 'rgba(194, 254, 0, 0.1)',
                borderColor: '#C2FE00',
                borderWidth: 3,
                pointBackgroundColor: '#C2FE00',
                pointBorderColor: '#8BB800',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.4
            }
        ]
    }), []);

    // Opções do gráfico responsivas
    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#2c3e50',
                    font: {
                        size: windowWidth <= 768 ? 12 : 14,
                        weight: '600'
                    },
                    padding: 20,
                    usePointStyle: true
                }
            },
            title: {
                display: true,
                text: windowWidth <= 576 ? 'Gastos Mensais (R$)' : 'Gastos Mensais com Estacionamento (R$)',
                color: '#2c3e50',
                font: {
                    size: windowWidth <= 768 ? 14 : 16,
                    weight: '700'
                },
                padding: 20
            },
            tooltip: {
                backgroundColor: 'rgba(44, 62, 80, 0.95)',
                titleColor: '#C2FE00',
                bodyColor: '#ffffff',
                borderColor: '#C2FE00',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return `R$ ${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    color: '#6c757d',
                    font: {
                        size: windowWidth <= 768 ? 10 : 12
                    },
                    callback: function(value) {
                        return `R$ ${value}`;
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6c757d',
                    font: {
                        size: windowWidth <= 768 ? 10 : 12
                    }
                }
            }
        },
        elements: {
            point: {
                radius: windowWidth <= 768 ? 4 : 6,
                hoverRadius: windowWidth <= 768 ? 6 : 8
            },
            line: {
                borderWidth: windowWidth <= 768 ? 2 : 3
            }
        }
    }), [windowWidth]);

    const API_BASE = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        fetchEstacionamentosProximos();
        
        // Listener para redimensionamento da tela
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchEstacionamentosProximos = async () => {
        try {
            setLoading(true);
            const headers = {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            };

            const res = await fetch(`${API_BASE}/estacionamentos/proximos`, {
                method: 'GET',
                headers
            });

            if (res.ok) {
                const data = await res.json();
                setEstacionamentosProximos(data.slice(0, 4));
            }
        } catch (err) {
            console.log('Erro ao carregar estacionamentos próximos, usando mock:', err);
            // Mock data para estacionamentos próximos
            setEstacionamentosProximos([
                {
                    id: 1,
                    nome: "Shopping Center Norte",
                    endereco: "Av. Otto Baumgart, 500",
                    distancia: "0.5 km",
                    vagasDisponiveis: 45,
                    maximoDeVagas: 80,
                    precoHora: 5.00
                },
                {
                    id: 2,
                    nome: "Estacionamento Central",
                    endereco: "Rua Augusta, 1500",
                    distancia: "1.2 km",
                    vagasDisponiveis: 12,
                    maximoDeVagas: 60,
                    precoHora: 4.50
                },
                {
                    id: 3,
                    nome: "Parque Dom Pedro",
                    endereco: "Av. do Estado, 3000",
                    distancia: "2.1 km",
                    vagasDisponiveis: 78,
                    maximoDeVagas: 200,
                    precoHora: 3.00
                },
                {
                    id: 4,
                    nome: "Vila Madalena Park",
                    endereco: "Rua Harmonia, 200",
                    distancia: "3.0 km",
                    vagasDisponiveis: 5,
                    maximoDeVagas: 40,
                    precoHora: 6.00
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/estacionamentos?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    const getVagasStatus = (disponiveis, total) => {
        const percentual = (disponiveis / total) * 100;
        if (percentual > 50) return { status: 'alta', color: '#10b981', label: 'Alta disponibilidade' };
        if (percentual > 20) return { status: 'media', color: '#f59e0b', label: 'Disponibilidade média' };
        return { status: 'baixa', color: '#ef4444', label: 'Poucas vagas' };
    };

    return (
        <div className="dashboard">
            {/* Header Principal da Dashboard */}
            <div className="dashboard-main-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1 className="dashboard-title">
                            Olá, {user?.nome?.split(' ')[0] || user?.email?.split('@')[0] || 'Cliente'}! 👋
                        </h1>
                        <p className="dashboard-subtitle">
                            Pronto para encontrar sua vaga ideal? Gerencie suas reservas e explore estacionamentos próximos.
                        </p>
                    </div>
                </div>
                
                {/* Stats Rápidas */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <MdLocalParking />
                        </div>
                        <div className="stat-info">
                            <span className="stat-number">{estacionamentosProximos.length}</span>
                            <span className="stat-label">Estacionamentos próximos</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <MdCalendarToday />
                        </div>
                        <div className="stat-info">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Reserva ativa</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <MdDirectionsCar />
                        </div>
                        <div className="stat-info">
                            <span className="stat-number">
                                {estacionamentosProximos.reduce((acc, est) => acc + est.vagasDisponiveis, 0)}
                            </span>
                            <span className="stat-label">Vagas disponíveis</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Opções Rápidas */}
            <div className="quick-actions-section">
                <h2>Acesso Rápido</h2>
                <div className="quick-actions-grid">
                    <button 
                        className="quick-action-item"
                        onClick={() => navigate('/notificacoes')}
                    >
                        <MdNotifications className="quick-action-icon" />
                        <div className="quick-action-content">
                            <h3>Notificações</h3>
                            <p>Alertas e lembretes</p>
                        </div>
                        <MdChevronRight className="chevron" />
                    </button>

                    <button 
                        className="quick-action-item"
                        onClick={() => navigate('/meu-perfil')}
                    >
                        <MdPerson className="quick-action-icon" />
                        <div className="quick-action-content">
                            <h3>Meu Perfil</h3>
                            <p>Dados pessoais e configurações</p>
                        </div>
                        <MdChevronRight className="chevron" />
                    </button>

                    <button 
                        className="quick-action-item"
                        onClick={() => navigate('/meus-carros')}
                    >
                        <MdDirectionsCar className="quick-action-icon" />
                        <div className="quick-action-content">
                            <h3>Meus Carros</h3>
                            <p>Cadastre seus veículos</p>
                        </div>
                        <MdChevronRight className="chevron" />
                    </button>

                    <button 
                        className="quick-action-item"
                        onClick={() => navigate('/minhas-reservas')}
                    >
                        <MdLocalParking className="quick-action-icon" />
                        <div className="quick-action-content">
                            <h3>Minhas Reservas</h3>
                            <p>Gerencie suas reservas</p>
                        </div>
                        <MdChevronRight className="chevron" />
                    </button>
                </div>
            </div>

            {/* Gráfico de Gastos Mensais */}
            <div className="gastos-chart-section">
                <div className="chart-header">
                    <h2>
                        <MdTrendingUp className="chart-icon" />
                        Gastos do Mês
                    </h2>
                    <div className="chart-stats">
                        <div className="stat-item">
                            <span className="stat-label">Este mês</span>
                            <span className="stat-value">R$ 240,00</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Média mensal</span>
                            <span className="stat-value">R$ 188,00</span>
                        </div>
                    </div>
                </div>
                <div className="chart-container">
                    <Line data={gastosData} options={chartOptions} />
                </div>
            </div>

            <div className="estacionamentos-proximos-section">
                <div className="section-header">
                    <h2>Estacionamentos Próximos</h2>
                    <button 
                        className="ver-todos-btn"
                        onClick={() => navigate('/estacionamentos')}
                    >
                        Ver todos
                        <MdChevronRight />
                    </button>
                </div>
                
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Carregando estacionamentos...</p>
                    </div>
                ) : (
                    <div className="estacionamentos-grid">
                        {estacionamentosProximos.map((est) => {
                            const vagasStatus = getVagasStatus(est.vagasDisponiveis, est.maximoDeVagas);
                            return (
                                <div key={est.id} className="estacionamento-card">
                                    <div className="card-header">
                                        <h3>{est.nome}</h3>
                                        <span className="distancia">{est.distancia}</span>
                                    </div>
                                    <div className="card-content">
                                        <div className="endereco">
                                            <MdLocationOn className="icon" />
                                            <span>{est.endereco}</span>
                                        </div>
                                        <div className="vagas-info">
                                            <div className="vagas-count">
                                                <span className="vagas-disponiveis" style={{ color: vagasStatus.color }}>
                                                    {est.vagasDisponiveis}
                                                </span>
                                                <span className="vagas-total">/ {est.maximoDeVagas} vagas</span>
                                            </div>
                                            <span className="vagas-status" style={{ color: vagasStatus.color }}>
                                                {vagasStatus.label}
                                            </span>
                                        </div>
                                        <div className="preco">
                                            <span>R$ {est.precoHora.toFixed(2).replace('.', ',')}/hora</span>
                                        </div>
                                    </div>
                                    <button 
                                        className="reservar-btn"
                                        onClick={() => navigate(`/estacionamento/${est.id}`)}
                                        disabled={est.vagasDisponiveis === 0}
                                    >
                                        {est.vagasDisponiveis === 0 ? 'Lotado' : 'Ver Detalhes'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Busca Rápida */}
            <div className="search-section">
                <h2>Onde você quer estacionar?</h2>
                <form onSubmit={handleSearch} className="quick-search">
                    <div className="search-bar">
                        <MdSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Busque por endereço ou nome do estacionamento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            Buscar
                        </button>
                    </div>
                    <button type="button" className="location-button">
                        <MdMyLocation />
                        Usar minha localização
                    </button>
                </form>
            </div>
        </div>
    );
}