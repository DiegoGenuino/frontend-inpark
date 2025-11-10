import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/auth";
import InparkLogo from "../../assets/inpark.svg"
import './Sidebar.css'
// Importando ícones do React Icons
import { 
    MdDashboard, 
    MdLocalParking, 
    MdEventNote, 
    MdAttachMoney,
    MdPeople,
    MdAssessment,
    MdExitToApp,
    MdPerson,
    MdSettings,
    MdHome,
    MdBarChart,
    MdList,
    MdAddBusiness
} from 'react-icons/md';

export const SidebarDono = () => {
    const { role, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        
        // Remover token do localStorage
        localStorage.removeItem('token');
        
        // Chamar função de logout do contexto
        logout();
        
        // Redirecionar para página de login
        navigate('/');
        
        console.log('✅ Logout realizado com sucesso');
    };

    // Extrair primeiro nome do usuário
    const firstName = user?.nome ? user.nome.split(' ')[0] : 'Dono';

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
                            <Link to="/dono" className="nav-link">
                                <MdHome className="nav-icon" />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dono/estacionamentos" className="nav-link">
                                <MdLocalParking className="nav-icon" />
                                <span>Meus Estacionamentos</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dono/reservas" className="nav-link">
                                <MdEventNote className="nav-icon" />
                                <span>Reservas Recebidas</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="nav-section">
                    <h3 className="section-title">GESTÃO</h3>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link to="/dono/vagas" className="nav-link">
                                <MdList className="nav-icon" />
                                <span>Gerenciar Vagas</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dono/financeiro" className="nav-link">
                                <MdAttachMoney className="nav-icon" />
                                <span>Financeiro</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dono/relatorios" className="nav-link">
                                <MdBarChart className="nav-icon" />
                                <span>Relatórios</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="nav-section">
                    <h3 className="section-title">MINHA CONTA</h3>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <Link to="/dono/perfil" className="nav-link">
                                <MdPerson className="nav-icon" />
                                <span>Meu Perfil</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dono/configuracoes" className="nav-link">
                                <MdSettings className="nav-icon" />
                                <span>Configurações</span>
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
                    <span className="version-subtitle">Dono</span>
                </div>
            </div>
        </aside>
    )
}
