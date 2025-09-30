import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../utils/auth";
import './Sidebar.css'
import InparkLogo from '../../assets/inpark.svg';
export const Sidebar = () => {
    const { role } = useAuth();

    return (
        <aside>
            <div className="sidebar-header">
                <div className="sidebar-user-picture"></div>
                <div className="sidebar-user-information">
                    <span>Olá, {role}</span>
                    <img className='inpark-logotipo' src={InparkLogo} alt="Logotipo Inpark" />
                </div>
            </div>
            <ul>
                {/* Links sempre visiveis */}
                <li><Link to="/">Menu</Link></li>
                <li><Link to="/estacionamentos">Estacionamentos</Link></li>
                <li><Link to="/minhas-reservas">Minhas reservas</Link></li>

                {role === 'usuario' && (
                    <>
                        <li><Link to="/minhas-reservas">Minhas reservas</Link></li>
                        <li><Link to="/reservas">Reservas</Link></li>
                    </>
                )}

                {role === 'gerente' && (
                    <>
                        <li><Link to="/manage-users">Gerenciar Usuários</Link></li>
                        <li><Link to="/view-reports">Ver Relatórios</Link></li>
                    </>
                )}

                {role === 'dono' && (
                    <>
                        <li><Link to="/admin-settings">Configurações</Link></li>
                        <li><Link to="/company-info">Informações da Empresa</Link></li>
                    </>
                )}
            </ul>
        </aside >
    )
}