import React from 'react';
import './PageHeader.css';

const PageHeader = ({ 
  title, 
  subtitle, 
  actions,
  stats 
}) => {
  return (
    <div className="page-header-container">
      <div className="page-header-content">
        <div className="page-header-text">
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
          <h1 className="page-header-title">{title}</h1>
        </div>
        
        {actions && (
          <div className="page-header-actions">
            {actions}
          </div>
        )}
      </div>

      {stats && stats.length > 0 && (
        <div className="page-header-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
