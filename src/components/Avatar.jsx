import React from 'react';

export const Avatar = ({ 
  initials = 'AJ', 
  emoji, 
  color = '#C4F1F7', 
  size = 'md', 
  status,
  className = "" 
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl'
  };

  const badgeSizeMap = {
    sm: 'w-2.5 h-2.5 bottom-0 right-0 border',
    md: 'w-3.5 h-3.5 bottom-0 right-0 border-2',
    lg: 'w-4 h-4 bottom-0.5 right-0.5 border-2',
    xl: 'w-5 h-5 bottom-1 right-1 border-2'
  };

  const isOnline = status === 'Online';

  return (
    <div className={`relative inline-block ${className}`}>
      <div 
        className={`${sizeMap[size]} border-[2.5px] border-[#202020] rounded-xl flex items-center justify-center font-bold tracking-tight text-[#202020] shadow-[2px_2px_0px_#202020] transition-transform hover:scale-105 select-none`}
        style={{ backgroundColor: color }}
      >
        {emoji ? (
          <span className="text-base">{emoji}</span>
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {status && (
        <span 
          className={`absolute ${badgeSizeMap[size]} rounded-full border-[#202020] ${isOnline ? 'bg-[#4ADE80]' : 'bg-[#94A3B8]'}`}
          title={status}
        />
      )}
    </div>
  );
};
