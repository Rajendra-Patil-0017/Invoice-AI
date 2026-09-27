import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow focus:ring-blue-500 rounded-lg',
    secondary: 'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm focus:ring-slate-300 rounded-lg',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-400 rounded-lg',
    ghost: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200 hover:text-slate-900 focus:ring-slate-300 rounded-lg',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 rounded-lg',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-4 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      {children}
    </button>
  );
};
