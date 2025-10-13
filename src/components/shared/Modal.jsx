import React, { useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import Button from './Button';
import './Modal.css';

/**
 * Modal Component - Componente minimalista para pop-ups/diálogos
 * @param {boolean} isOpen - Controla visibilidade do modal
 * @param {function} onClose - Callback para fechar o modal
 * @param {string} title - Título do modal
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} closeOnOverlay - Fecha ao clicar no overlay (padrão: true)
 * @param {boolean} closeOnEsc - Fecha ao pressionar ESC (padrão: true)
 * @param {boolean} showCloseButton - Mostra botão X de fechar (padrão: true)
 * @param {string} className - Classes CSS adicionais
 */
export const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  className = ''
}) => {
  // Fechar com ESC
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  // Prevenir scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const modalClasses = [
    'modal__content',
    `modal__content--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <div className="modal__header">
            {title && <h2 className="modal__title">{title}</h2>}
            {showCloseButton && (
              <button
                className="modal__close-button"
                onClick={onClose}
                aria-label="Fechar modal"
              >
                <MdClose />
              </button>
            )}
          </div>
        )}

        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * ModalHeader - Cabeçalho customizado do modal
 */
export const ModalHeader = ({ children, className = '' }) => (
  <div className={`modal__header ${className}`}>
    {children}
  </div>
);

/**
 * ModalBody - Corpo do modal
 */
export const ModalBody = ({ children, className = '' }) => (
  <div className={`modal__body ${className}`}>
    {children}
  </div>
);

/**
 * ModalFooter - Rodapé com ações do modal
 */
export const ModalFooter = ({ children, className = '' }) => (
  <div className={`modal__footer ${className}`}>
    {children}
  </div>
);

/**
 * ModalActions - Container para botões de ação
 */
export const ModalActions = ({ 
  children,
  align = 'right',
  className = '' 
}) => (
  <div className={`modal__actions modal__actions--${align} ${className}`}>
    {children}
  </div>
);

export default Modal;
