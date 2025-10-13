import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../utils/auth";
import InparkLogo from "../../assets/inpark.svg"
import './Sidebar.css'
// Importando ícones do React Icons
import { 
    MdDashboard, 
    MdLocalParking, 
    MdEventNote, 
    MdBookmarks,
    MdDirectionsCar,
    MdAssessment,
    MdExitToApp,
    MdSearch,
    MdPerson,
    MdNotifications,
    MdReceiptLong,
    MdHome
} from 'react-icons/md';

export const Sidebar = () => {
    const { role, user, logout } = useAuth();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        logout();
    };

    // Extrair primeiro nome do usuário
    const firstName = user?.nome ? user.nome.split(' ')[0] : 'Usuário';

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                        <div className="brand-name">
                            <img src={InparkLogo} alt="Inpark" className="inpark-logo-img" />
                </div>
            </div>
            
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <h3 className="section-title">PRINCIPAL</h3>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                <MdHome className="nav-icon" />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/minhas-reservas" className="nav-link">
                                <MdBookmarks className="nav-icon" />
                                <span>Minhas Reservas</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/estacionamentos" className="nav-link">
                                <MdLocalParking className="nav-icon" />
                                <span>Estacionamentos</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="nav-section">
                    <h3 className="section-title">MINHA CONTA</h3>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link to="/meus-carros" className="nav-link">
                                <MdDirectionsCar className="nav-icon" />
                                <span>Meus Carros</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/meu-perfil" className="nav-link">
                                <MdPerson className="nav-icon" />
                                <span>Meu Perfil</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/notificacoes" className="nav-link">
                                <MdNotifications className="nav-icon" />
                                <span>Notificações</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/relatorio-despesas" className="nav-link">
                                <MdReceiptLong className="nav-icon" />
                                <span>Relatório de Despesas</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="nav-section">
                    <h3 className="section-title">SISTEMA</h3>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <a href="/sair" className="nav-link exit-link" onClick={handleLogout}>
                                <MdExitToApp className="nav-icon" />
                                <span>Sair</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="version-info">
                    Inpark v1.0<br />
                    <span className="version-subtitle">General</span>
                </div>
            </div>
        </aside>
    )
}