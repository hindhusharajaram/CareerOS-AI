import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  badge,
  action,
  icon,
  className = '',
}: SectionHeaderProps): React.ReactElement {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800/80 mb-6 ${className}`}>
      <div>
        {badge && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            {badge}
          </span>
        )}
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          {icon && <span className="text-indigo-400">{icon}</span>}
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-1.5 leading-relaxed max-w-2xl">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
