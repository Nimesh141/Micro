import React from 'react';

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  rightElement,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs md:text-sm font-extrabold tracking-wider uppercase text-[#202020] flex items-center gap-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-4 text-[#536D6B] pointer-events-none flex items-center justify-center">
            <Icon size={20} strokeWidth={2.5} />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full py-3.5 px-4 text-sm md:text-base font-semibold text-[#202020] placeholder-[#7A9593]
            bg-white border-[2.5px] border-[#202020] rounded-xl outline-none min-h-[52px]
            transition-all duration-150
            focus:shadow-[4px_4px_0px_#202020] focus:bg-white
            ${Icon ? 'pl-11' : ''}
            ${rightElement ? 'pr-12' : ''}
            ${error ? 'border-red-500' : ''}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <span className="text-xs font-bold text-red-600 mt-1">{error}</span>}
    </div>
  );
};
