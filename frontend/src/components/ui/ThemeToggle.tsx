import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, ChevronDown } from 'lucide-react';
import { useTheme, Theme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'buttons' | 'dropdown' | 'icon-only';
  className?: string;
}

export function ThemeToggle({ variant = 'buttons', className = '' }: ThemeToggleProps): React.ReactElement {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions: { key: Theme; label: string; icon: React.ElementType }[] = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Laptop },
  ];

  if (variant === 'icon-only') {
    return (
      <button
        onClick={() => {
          if (theme === 'dark') setTheme('light');
          else if (theme === 'light') setTheme('system');
          else setTheme('dark');
        }}
        title={`Current theme: ${theme} (Click to cycle)`}
        className={`p-2 rounded-xl border border-borderMain bg-card hover:bg-cardHover text-textPrimary transition-all duration-200 shadow-sm ${className}`}
      >
        {resolvedTheme === 'dark' ? (
          <Moon className="h-4 w-4 text-indigo-400" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
      </button>
    );
  }

  if (variant === 'dropdown') {
    const currentOption = themeOptions.find((o) => o.key === theme) || themeOptions[2];
    const CurrentIcon = currentOption.icon;

    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-borderMain bg-card hover:bg-cardHover text-textPrimary text-xs font-semibold shadow-sm transition-all"
        >
          <CurrentIcon className="h-3.5 w-3.5 text-indigo-500" />
          <span className="capitalize">{theme}</span>
          <ChevronDown className={`h-3 w-3 text-textSecondary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-36 rounded-xl border border-borderMain bg-card shadow-xl backdrop-blur-xl p-1 z-50 animate-fade-in">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              const active = theme === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    setTheme(opt.key);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-textSecondary hover:text-textPrimary hover:bg-cardHover'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active ? 'text-indigo-500' : 'text-textSecondary'}`} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Default: Segmented pills design (Vercel / Linear style)
  return (
    <div className={`inline-flex items-center p-0.5 rounded-xl border border-borderMain bg-card backdrop-blur-md shadow-sm ${className}`}>
      {themeOptions.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => setTheme(opt.key)}
            title={`${opt.label} mode`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
              active
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950/20'
                : 'text-textSecondary hover:text-textPrimary hover:bg-cardHover'
            }`}
          >
            <Icon className={`h-3.5 w-3.5 ${active ? 'text-white' : ''}`} />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
