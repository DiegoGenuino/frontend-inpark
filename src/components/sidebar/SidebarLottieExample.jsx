// Exemplo de uso de ícones Lottie na Sidebar

import React from 'react';
import { LottieIcon } from '../../components/shared';

// Importar os arquivos JSON das animações
// Baixe ícones em: https://lottiefiles.com/
import dashboardIcon from '../../assets/lottie/dashboard-icon.json';
import parkingIcon from '../../assets/lottie/parking-icon.json';

export const SidebarWithLottie = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {/* Exemplo 1: Ícone animado simples */}
          <li className="nav-item">
            <a href="/dashboard" className="nav-link">
              <LottieIcon 
                animationData={dashboardIcon}
                width={20}
                height={20}
                loop={true}
                className="nav-icon"
              />
              <span>Dashboard</span>
            </a>
          </li>

          {/* Exemplo 2: Ícone que anima apenas no hover */}
          <li className="nav-item">
            <a href="/estacionamentos" className="nav-link">
              <LottieIcon 
                animationData={parkingIcon}
                width={20}
                height={20}
                loop={false}
                autoplay={false}
                className="nav-icon lottie-hover"
              />
              <span>Estacionamentos</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

// CSS para animar no hover (adicionar no Sidebar.css)
/*
.nav-link:hover .lottie-hover {
  animation: lottie-play 0.6s ease-in-out;
}

@keyframes lottie-play {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
*/
