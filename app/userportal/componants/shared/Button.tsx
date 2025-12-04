import React from "react";

interface ButtonProps {
  type?: string | any;
  className?: string;
  name: string;
  onClick?: (e:any) => void ;
}

const Button: React.FC<ButtonProps> = ({ type, name, className, onClick }) => {
  return (
    <button onClick={onClick} className={className} type={type}>
      {name}
    </button>
  );
};

export default Button;
