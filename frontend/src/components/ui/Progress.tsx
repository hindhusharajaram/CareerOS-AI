import React from 'react';

// ===== Progress Bar =====
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  color?: 'indigo' | 'purple' | 'emerald' | 'amber' | 'rose' | 'sky' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

function getAutoColor(value: number, max: number = 100) {
  const pct = (value / max) * 100;
  if (pct >= 80) return 'from-emerald-500 to-emerald-400';
  if (pct >= 60) return 'from-indigo-500 to-purple-500';
  if (pct >= 40) return 'from-amber-500 to-orange-400';
  return 'from-red-500 to-rose-400';
}

const colorGradients = {
  indigo: 'from-indigo-500 to-indigo-400',
  purple: 'from-purple-500 to-violet-400',
  emerald: 'from-emerald-500 to-teal-400',
  amber: 'from-amber-500 to-yellow-400',
  rose: 'from-rose-500 to-red-400',
  sky: 'from-sky-500 to-cyan-400',
  auto: '',
};

const sizeHeights = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  sublabel,
  color = 'emerald',
  size = 'md',
  showValue = true,
  animated = true,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const gradient = color === 'auto' ? getAutoColor(value, max) : colorGradients[color];

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          <div>
            {label && <p className="text-sm font-semibold text-slate-200">{label}</p>}
            {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
          </div>
          {showValue && (
            <span className="text-sm font-bold text-slate-300 font-mono">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-900 rounded-full overflow-hidden ${sizeHeights[size]} border border-slate-800`}>
        <div
          className={`bg-gradient-to-r ${gradient} ${sizeHeights[size]} rounded-full ${animated ? 'transition-all duration-1000 ease-out' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ===== Progress Ring (SVG) =====
interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'indigo' | 'purple' | 'emerald' | 'amber' | 'blue';
  children?: React.ReactNode;
  className?: string;
  animated?: boolean;
}

const ringColors = {
  indigo: '#6366f1',
  purple: '#8b5cf6',
  emerald: '#10b981',
  amber: '#f59e0b',
  blue: '#2E4CFF',
};

const ringTrackColors = {
  indigo: '#1e1b4b',
  purple: '#2e1065',
  emerald: '#064e3b',
  amber: '#451a03',
  blue: '#E5E0D8',
};

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'emerald',
  children,
  className = '',
}: ProgressRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringTrackColors[color]}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColors[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
      </svg>
      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
