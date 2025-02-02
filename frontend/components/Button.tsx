import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ButtonProps {
  onClick: () => void;
  icon?: IconDefinition;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean; // Add disabled prop
}

const Button: React.FC<ButtonProps> = ({ onClick, icon, children, className, disabled }) => {
  return (
    <button onClick={onClick} className={`btn ${className}`} disabled={disabled}>
      {icon && <FontAwesomeIcon icon={icon} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;