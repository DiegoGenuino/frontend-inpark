import React from 'react';
import Lottie from 'lottie-react';

/**
 * Componente para exibir ícones animados Lottie (JSON)
 * 
 * @param {Object} animationData - Dados JSON da animação Lottie
 * @param {Number} width - Largura do ícone (default: 24px)
 * @param {Number} height - Altura do ícone (default: 24px)
 * @param {Boolean} loop - Se a animação deve repetir (default: true)
 * @param {Boolean} autoplay - Se deve iniciar automaticamente (default: true)
 * @param {String} className - Classes CSS adicionais
 * @param {Object} style - Estilos inline
 */
const LottieIcon = ({ 
  animationData, 
  width = 24, 
  height = 24, 
  loop = true, 
  autoplay = true,
  className = '',
  style = {},
  ...props 
}) => {
  const defaultStyle = {
    width: width,
    height: height,
    ...style
  };

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      style={defaultStyle}
      className={className}
      {...props}
    />
  );
};

export default LottieIcon;
