import React, { useEffect } from 'react';
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from 'react-icons/md';
import './Toast.css';

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <MdCheckCircle />,
    error: <MdError />,
    warning: <MdWarning />,
    info: <MdInfo />
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {icons[type]}
      </div>
      <div className="toast-message">
        {message}
      </div>
      <button className="toast-close" onClick={onClose}>
        <MdClose />
      </button>
    </div>
  );
};

export default Toast;
