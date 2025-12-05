import React from 'react';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon, 
  isLoading,
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative group overflow-hidden font-display uppercase tracking-wider text-sm font-bold py-2 px-4 transition-all duration-300 clip-path-slant flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-cyan-900/30 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]",
    secondary: "bg-purple-900/30 text-purple-400 border border-purple-500/50 hover:bg-purple-500 hover:text-black hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]",
    danger: "bg-red-900/30 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-black hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]",
    ghost: "text-slate-400 hover:text-cyan-400 border border-transparent hover:border-cyan-500/30 hover:bg-cyan-900/10"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Glitch overlay effect on hover */}
      <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine transition-all"></span>
      
      {isLoading ? (
        <span className="animate-pulse">PROCESSING...</span>
      ) : (
        <>
          {icon && <span className="w-4 h-4">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
