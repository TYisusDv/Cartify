import React from "react";

interface TooltipButtonProps {
  tooltip: string; 
  onClick: () => void; 
  disabled?: boolean; 
  className: string; 
  icon: React.ReactNode;
}

const TooltipButton: React.FC<TooltipButtonProps> = ({
  tooltip,
  onClick,
  disabled = false,
  className,
  icon,
}) => {
  return (
    <div className="relative group inline-block">
      <button
        className={`rounded-full p-3 transition ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
      </button>
      <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-max text-sm text-white bg-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {tooltip}
      </span>
    </div>
  );
};

export default TooltipButton;
