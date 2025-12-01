import React from 'react';
import './Header.css';

const Header = ({ title, subtitle, actions }) => {
  return (
    <div className="header-component">
      <div className="header-component-content">
        <div className="header-component-text">
          {subtitle && <p className="header-component-subtitle">{subtitle}</p>}
          <h1 className="header-component-title">{title}</h1>
        </div>
        {actions && (
          <div className="header-component-actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
