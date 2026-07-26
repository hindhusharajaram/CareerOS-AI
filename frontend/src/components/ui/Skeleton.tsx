// ===== Skeleton Text =====
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-4 rounded-lg ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

// ===== Skeleton Card =====
interface SkeletonCardProps {
  className?: string;
  showAvatar?: boolean;
}

export function SkeletonCard({ className = '', showAvatar = false }: SkeletonCardProps) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/50 p-6 ${className}`}>
      {showAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="skeleton h-3 w-1/3 rounded" />
            <div className="skeleton h-3 w-1/4 rounded" />
          </div>
        </div>
      )}
      <div className="skeleton h-5 w-2/3 rounded mb-3" />
      <SkeletonText lines={2} />
    </div>
  );
}

// ===== Skeleton Stat Grid =====
export function SkeletonStatGrid({ cols = 4 }: { cols?: number }) {
  return (
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-${cols}`}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="skeleton h-11 w-11 rounded-xl" />
            <div className="skeleton h-8 w-16 rounded" />
          </div>
          <div className="skeleton h-4 w-2/3 rounded mb-1" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

// ===== Skeleton Chart =====
export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/50 p-6 ${className}`}>
      <div className="skeleton h-5 w-48 rounded mb-6" />
      <div className="flex items-end gap-3 h-40">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="skeleton flex-1 rounded-t-lg"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// ===== Skeleton Table =====
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="p-4 border-b border-slate-800">
        <div className="skeleton h-4 w-40 rounded" />
      </div>
      <div className="divide-y divide-slate-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="skeleton h-8 w-8 rounded-lg" />
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-4 w-24 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
