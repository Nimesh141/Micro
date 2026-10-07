import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-extrabold tracking-tight border-[2.5px] border-[#202020] rounded-xl transition-all duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    // Primary: Soft Cyan background with bold BLACK text as explicitly requested
    primary: 'bg-[#C4F1F7] text-[#202020] hover:bg-[#A9ECEF] shadow-[4.5px_4.5px_0px_#202020] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#202020]',
    // Dark: Charcoal background with white text
    dark: 'bg-[#202020] text-white hover:bg-[#333333] shadow-[4.5px_4.5px_0px_#536D6B] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#536D6B]',
    // Secondary: Soft Lavender background with bold BLACK text
    secondary: 'bg-[#C9BDF2] text-[#202020] hover:bg-[#B8A8EE] shadow-[4.5px_4.5px_0px_#202020] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#202020]',
    // Accent: Pale green background with bold BLACK text
    accent: 'bg-[#F2FFDF] text-[#202020] hover:bg-[#E4FCBF] shadow-[4.5px_4.5px_0px_#202020] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#202020]',
    // White: Crisp white background with bold BLACK text
    white: 'bg-white text-[#202020] hover:bg-[#F8FAFC] shadow-[4.5px_4.5px_0px_#202020] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#202020]',
    // Outline: Transparent with thick border and BLACK text
    outline: 'bg-transparent text-[#202020] hover:bg-black/5 shadow-[3.5px_3.5px_0px_#202020] active:translate-x-[1px] active:translate-y-[1px]'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs md:text-sm min-h-[44px] gap-2',
    md: 'px-6 py-3.5 text-sm md:text-base min-h-[60px] h-[60px] gap-2.5',
    lg: 'px-8 py-4 text-base md:text-lg min-h-[60px] h-[60px] gap-3 font-extrabold'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
