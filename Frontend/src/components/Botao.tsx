import React from 'react';
import './Botao.css';

interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'desativado';
  fullWidth?: boolean;
}

const Botao: React.FC<BotaoProps> = ({ 
  children, 
  variante = 'primario', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const classes = `btn btn-${variante} ${fullWidth ? 'btn-full' : ''} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Botao;
