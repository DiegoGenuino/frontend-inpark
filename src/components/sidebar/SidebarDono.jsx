import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    MdAddBusiness,
    MdDirectionsCar,
    MdMenu,
    MdClose
} from 'react-icons/md';

export const SidebarDono = () => {
    const { role, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

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
        <>
            {/* Botão Hambúrguer Mobile */}
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Menu">
                {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>

            {/* Overlay para fechar menu ao clicar fora */}
            {isMobileMenuOpen && (
                <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
            )}

            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
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
                            <Link to="/dono" className="nav-link" onClick={closeMobileMenu}>
                                <MdHome className="nav-icon" />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dono/estacionamentos" className="nav-link" onClick={closeMobileMenu}>
                                <MdLocalParking className="nav-icon" />
                                <span>Meus Estacionamentos</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dono/reservas" className="nav-link" onClick={closeMobileMenu}>
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
                            <Link to="/dono/acessos" className="nav-link" onClick={closeMobileMenu}>
                                <MdDirectionsCar className="nav-icon" />
                                <span>Acessos em Tempo Real</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dono/vagas" className="nav-link" onClick={closeMobileMenu}>
                                <MdList className="nav-icon" />
                                <span>Gerenciar Vagas</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dono/financeiro" className="nav-link" onClick={closeMobileMenu}>
                                <MdAttachMoney className="nav-icon" />
                                <span>Financeiro</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dono/relatorios" className="nav-link" onClick={closeMobileMenu}>
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
                            <Link to="/dono/perfil" className="nav-link" onClick={closeMobileMenu}>
                                <MdPerson className="nav-icon" />
                                <span>Meu Perfil</span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/dono/configuracoes" className="nav-link" onClick={closeMobileMenu}>
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
        </>
    )
}
