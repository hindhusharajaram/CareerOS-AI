import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: `
    bg-gradient-to-r from-indigo-600 to-purple-600
    hover:from-indigo-500 hover:to-purple-500
    text-white shadow-lg shadow-indigo-500/20
    hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]
  `,
  secondary: `
    bg-slate-800 border border-slate-700/50
    hover:bg-slate-700 hover:border-slate-600
    text-slate-200 hover:text-white
  `,
  ghost: `
    text-slate-400 hover:text-white
    hover:bg-slate-800/60
  `,
  danger: `
    bg-red-600/20 border border-red-500/30
    hover:bg-red-600/30 hover:border-red-500/50
    text-red-400 hover:text-red-300
  `,
  outline: `
    border border-slate-700/50 hover:border-indigo-500/50
    text-slate-300 hover:text-white
    hover:bg-indigo-500/5
  `,
  gradient: `
    relative overflow-hidden
    bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600
    text-white shadow-xl shadow-indigo-500/25
    hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]
    before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100
    before:transition-opacity
  `,
};

const sizeClasses = {
  sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4.5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-sm rounded-xl gap-2',
  xl: 'px-8 py-4 text-base rounded-2xl gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  children,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center
        font-semibold transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-950
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
}
