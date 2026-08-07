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
    bg-emerald-600 hover:bg-emerald-500
    text-white shadow-sm shadow-emerald-950/20
    hover:scale-[1.01] active:scale-[0.99]
  `,
  secondary: `
    bg-zinc-800/80 border border-zinc-700/60 dark:bg-zinc-800 dark:border-zinc-700
    hover:bg-zinc-700 hover:border-zinc-600
    text-zinc-200 hover:text-white
  `,
  ghost: `
    text-zinc-400 hover:text-zinc-100
    hover:bg-zinc-800/50
  `,
  danger: `
    bg-rose-600/10 border border-rose-500/20
    hover:bg-rose-600/20 hover:border-rose-500/40
    text-rose-400 hover:text-rose-300
  `,
  outline: `
    border border-zinc-700/60 hover:border-emerald-500/50
    text-zinc-300 hover:text-white
    hover:bg-emerald-500/5
  `,
  gradient: `
    relative overflow-hidden
    bg-gradient-to-r from-emerald-600 to-emerald-500
    text-white shadow-md shadow-emerald-500/20
    hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99]
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
        focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-2 focus:ring-offset-zinc-950
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
