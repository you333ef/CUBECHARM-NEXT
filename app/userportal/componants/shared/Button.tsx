import React from "react";

interface ButtonProps {
  type?: string;
  className?: string;
  name: string;
  onClick?: (e: any) => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  name,
  className,
  onClick,
  disabled = false,
}) => {
  return (
    <button
     
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {name}
    </button>
  );
};

export default Button;
