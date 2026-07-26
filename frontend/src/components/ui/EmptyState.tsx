import React from 'react';
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps): React.ReactElement {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="h-16 w-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-5 text-slate-500">
        {icon || <InboxIcon className="h-7 w-7" />}
      </div>
      <h3 className="text-base font-bold text-slate-300 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      )}
      {action && action}
    </div>
  );
}
