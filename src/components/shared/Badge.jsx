import React from 'react';
import './Badge.css';

export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  dot = false,
  className = '' 
}) => {
  const classes = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    dot && 'badge--dot',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {dot && <span className="badge__dot" />}
      {children}
    </span>
  );
};

export default Badge;
