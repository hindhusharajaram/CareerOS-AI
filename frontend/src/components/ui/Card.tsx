import React from 'react';

// ===== GlassCard =====
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export function GlassCard({ children, className = '', hover = false, onClick, padding = 'lg' }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-3xl glass-card
        ${paddingMap[padding]}
        ${hover ? 'card-interactive cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ===== StatCard =====
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: number;
  color?: 'indigo' | 'purple' | 'emerald' | 'amber' | 'sky' | 'rose';
  href?: string;
  onClick?: () => void;
}

const colorMap = {
  indigo: {
    icon: 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white',
    border: 'hover:border-indigo-500/30',
    value: 'text-white',
  },
  purple: {
    icon: 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white',
    border: 'hover:border-purple-500/30',
    value: 'text-white',
  },
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white',
    border: 'hover:border-emerald-500/30',
    value: 'text-white',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white',
    border: 'hover:border-amber-500/30',
    value: 'text-white',
  },
  sky: {
    icon: 'bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-white',
    border: 'hover:border-sky-500/30',
    value: 'text-white',
  },
  rose: {
    icon: 'bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-white',
    border: 'hover:border-rose-500/30',
    value: 'text-white',
  },
};

export function StatCard({ title, value, subtitle, icon, trend, color = 'emerald', onClick }: StatCardProps) {
  const colors = colorMap[color] || colorMap.emerald;
  return (
    <div
      onClick={onClick}
      className={`
        group relative rounded-2xl border border-borderMain bg-card
        p-6 backdrop-blur-md transition-all duration-300
        hover:bg-cardHover hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20
        ${colors.border}
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        {icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${colors.icon}`}>
            {icon}
          </div>
        )}
        <div className={`text-right ${icon ? '' : 'w-full text-left'}`}>
          <p className="text-3xl font-black tracking-tight text-textPrimary">{value}</p>
          {trend !== undefined && (
            <span className={`text-xs font-semibold ${trend >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-textPrimary">{title}</h3>
        {subtitle && <p className="text-xs text-textSecondary mt-0.5">{subtitle}</p>}
      </div>
      {/* Bottom accent bar */}
      <div className={`absolute bottom-0 left-0 h-0.5 w-0 rounded-b-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 group-hover:w-full`} />
    </div>
  );
}

// ===== FeatureCard =====
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
  badge?: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, color = 'emerald', badge, className = '' }: FeatureCardProps) {
  const colorClasses = {
    indigo: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white border-emerald-500/10 group-hover:border-emerald-500',
    purple: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white border-emerald-500/10 group-hover:border-emerald-500',
    emerald: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white border-emerald-500/10 group-hover:border-emerald-500',
    amber: 'bg-amber-500/10 text-amber-500 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white border-amber-500/10 group-hover:border-amber-500',
    sky: 'bg-sky-500/10 text-sky-500 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white border-sky-500/10 group-hover:border-sky-500',
    rose: 'bg-rose-500/10 text-rose-500 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white border-rose-500/10 group-hover:border-rose-500',
    violet: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white border-emerald-500/10 group-hover:border-emerald-500',
  };

  return (
    <div className={`group relative rounded-2xl border border-borderMain bg-card p-7 text-left backdrop-blur-md hover:bg-cardHover transition-all duration-300 card-interactive ${className}`}>
      {badge && (
        <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
          {badge}
        </div>
      )}
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 mb-5 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.emerald}`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-textPrimary mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{title}</h3>
      <p className="text-sm text-textSecondary leading-relaxed">{description}</p>
    </div>
  );
}
