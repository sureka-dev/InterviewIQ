import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 font-semibold'
  };

  const variantStyles = {
    primary: 'bg-[#E65A3C] hover:bg-[#D44D30] text-white shadow-sm hover:shadow active:scale-[0.99] focus-visible:ring-[#E65A3C]',
    secondary: 'bg-[#1C1917] hover:bg-[#292524] text-white shadow-sm hover:shadow active:scale-[0.99] focus-visible:ring-[#1C1917]',
    outline: 'border border-[#DDD7CE] hover:border-[#B5AEA2] bg-white text-[#1C1917] hover:bg-[#F9F7F3] shadow-xs active:scale-[0.99] focus-visible:ring-[#1C1917]',
    ghost: 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F0ECE4]/60 active:scale-[0.99] focus-visible:ring-[#1C1917]',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus-visible:ring-rose-500'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
