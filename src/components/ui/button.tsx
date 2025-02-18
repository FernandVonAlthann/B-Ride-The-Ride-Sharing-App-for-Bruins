import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
};
