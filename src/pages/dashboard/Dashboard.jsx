import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { MdPerson, MdDirectionsCar, MdLocalParking, MdChevronRight, MdStar } from 'react-icons/md';
import { Header } from '../../components/shared';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Função para traduzir a role
    const getRoleLabel = (userRole) => {
        const roles = {
            'CLIENTE': 'Cliente',
            'DONO': 'Proprietário',
            'ADMIN': 'Administrador'
        };
        return roles[userRole] || 'Cliente';
    };

    // Dados do gráfico de barras
    const gastosData = useMemo(() => {
        // Valores aleatórios para cada mês, alguns meses com destaque
        const mesesDestaque = [1, 3, 4, 5, 6, 9]; // Meses com cor verde forte
        const valores = [1.5, 6.5, 2.5, 10.5, 9, 8, 7, 3.5, 4, 9.5, 7, 6.5];
        
        // Ajustar barThickness baseado no tamanho da tela
        const barThickness = windowWidth <= 480 ? 12 : windowWidth <= 768 ? 16 : 24;
        
        return {
            labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
            datasets: [
                {
                    label: 'Gastos (R$)',
                    data: valores,
                    backgroundColor: valores.map((_, index) => 
                        mesesDestaque.includes(index) ? '#00FF00' : 'rgba(0, 255, 0, 0.3)'
                    ),
                    borderColor: valores.map((_, index) => 
                        mesesDestaque.includes(index) ? '#00FF00' : 'rgba(0, 255, 0, 0.3)'
                    ),
                    borderWidth: 0,
                    borderRadius: 6,
                    barThickness: barThickness,
                    maxBarThickness: barThickness,
                }
            ]
        };
    }, [windowWidth]);

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
                display: false
            },
            title: {
                display: false
            },
            tooltip: {
                enabled: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 12,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    stepSize: 3,
                    color: '#6c757d',
                    font: {
                        size: 12
                    }
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: '#6c757d',
                    font: {
                        size: 12
                    }
                }
            }
        }
    }), []);

    useEffect(() => {
        // Listener para redimensionamento da tela
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="dashboard">
            <Header 
                title={`Olá, ${user?.nome?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuário'}!`}
                subtitle="Bem-vindo ao seu painel de controle"
                actions={
                    <div className="card-user-info">
                        <MdPerson className="user-icon" />
                        <div className="info-user">
                            <span className="user-name">{user?.nome || user?.email || 'Usuário'}</span>
                            <span className="user-role">{getRoleLabel(role)}</span>
                        </div>
                    </div>
                }
            />

            <div className="dashboard-content">
                {/* Opções Rápidas */}
                <div className="quick-actions-section">
                    <h2>Acesso rápido</h2>
                    <div className="quick-actions-grid">
                        {/* Notificações desativado */}

                        <button
                            className="quick-action-item"
                            onClick={() => navigate('/meu-perfil')}
                        >
                            <div className="quick-action-icon-wrapper">
                                <MdPerson className="quick-action-icon" />
                            </div>
                            <div className="quick-action-content">
                                <h3>Meu perfil</h3>
                                <p>Acesso a dados pessoais</p>
                            </div>
                            <MdChevronRight className="chevron" />
                        </button>

                        <button
                            className="quick-action-item"
                            onClick={() => navigate('/meus-carros')}
                        >
                            <div className="quick-action-icon-wrapper">
                                <MdDirectionsCar className="quick-action-icon" />
                            </div>
                            <div className="quick-action-content">
                                <h3>Meus carros</h3>
                                <p>Cadastre seus veículos</p>
                            </div>
                            <MdChevronRight className="chevron" />
                        </button>

                        <button
                            className="quick-action-item"
                            onClick={() => navigate('/minhas-reservas')}
                        >
                            <div className="quick-action-icon-wrapper">
                                <MdLocalParking className="quick-action-icon" />
                            </div>
                            <div className="quick-action-content">
                                <h3>Minhas reservas</h3>
                                <p>Gerencie suas reservas</p>
                            </div>
                            <MdChevronRight className="chevron" />
                        </button>

                        <button
                            className="quick-action-item"
                            onClick={() => navigate('/minhas-avaliacoes')}
                        >
                            <div className="quick-action-icon-wrapper">
                                <MdStar className="quick-action-icon" />
                            </div>
                            <div className="quick-action-content">
                                <h3>Minhas avaliações</h3>
                                <p>Veja suas avaliações</p>
                            </div>
                            <MdChevronRight className="chevron" />
                        </button>
                    </div>
                </div>

                {/* Gráfico de Gastos Mensais */}
                <div className="gastos-chart-section">
                    <div className="chart-header">
                        <h2>Gastos do Mês</h2>
                        <div className="chart-stats">
                            <div className="stat-item">
                                <span className="stat-label">Este mês</span>
                                <span className="stat-value">R$ 100,00</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Média mensal</span>
                                <span className="stat-value">R$ 276,82</span>
                            </div>
                        </div>
                    </div>
                    <div className="chart-container">
                        <Bar data={gastosData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}