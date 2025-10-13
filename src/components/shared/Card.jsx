import React from 'react';
import './Card.css';

/**
 * Card Component - Componente base minimalista para cards
 * @param {string} variant - 'default' | 'outlined' | 'flat'
 * @param {string} padding - 'sm' | 'md' | 'lg'
 * @param {boolean} hoverable - Adiciona efeito hover
 * @param {function} onClick - Callback para cliques
 * @param {string} className - Classes CSS adicionais
 */
export const Card = ({ 
  children, 
  variant = 'default', 
  padding = 'md',
  hoverable = false,
  onClick,
  className = '' 
}) => {
  const classes = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    hoverable && 'card--hoverable',
    onClick && 'card--clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`card__header ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`card__body ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`card__footer ${className}`}>
    {children}
  </div>
);

export default Card;