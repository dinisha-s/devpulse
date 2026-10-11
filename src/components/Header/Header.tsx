import React from 'react';
import { Search, ShieldAlert, Activity, Layers, LayoutDashboard, Cpu, Command } from 'lucide-react';
import type { RateLimitState } from '../../types';
import { cn } from '../../utils/cn';

export type WorkstationView = 'board' | 'overview' | 'insights';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  rateLimit: RateLimitState;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  activeView?: WorkstationView;
  onViewChange?: (view: WorkstationView) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  rateLimit,
  searchInputRef,
  activeView = 'board',
  onViewChange,
}) => {
  const percentRemaining = Math.round((rateLimit.remaining / rateLimit.limit) * 100);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const resetMinutes = Math.max(0, Math.ceil((rateLimit.resetEpoch - nowSeconds) / 60));

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-2">
              DevPulse
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 border border-indigo-100">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">Developer Triage & PR Workstation</p>
          </div>
        </div>

        {/* View Switcher Navigation Tabs */}
        {onViewChange && (
          <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60 text-xs font-medium">
            <button
              onClick={() => onViewChange('board')}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 transition',
                activeView === 'board'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              )}
            >
              <Layers className="h-4 w-4 text-indigo-600" />
              <span>Triage Board</span>
            </button>

            <button
              onClick={() => onViewChange('overview')}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 transition',
                activeView === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              )}
            >
              <LayoutDashboard className="h-4 w-4 text-amber-500" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => onViewChange('insights')}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 transition',
                activeView === 'insights'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              )}
            >
              <Cpu className="h-4 w-4 text-purple-600" />
              <span>AI Insights</span>
            </button>
          </nav>
        )}

        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search issues or repos ('/' to focus)..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-9 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] text-slate-400 bg-white rounded border border-slate-200 font-mono shadow-2xs">
            /
          </kbd>
        </div>

        {/* Rate Limit Indicator & Shortcut Hints */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80 font-medium">
            <Command className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-slate-500">Shortcuts:</span>
            <kbd className="px-1.5 py-0.5 bg-white text-slate-800 rounded text-[10px] font-mono border border-slate-200 shadow-2xs">J/K</kbd>
            <span className="text-[10px] text-slate-400">Nav</span>
            <kbd className="px-1.5 py-0.5 bg-white text-slate-800 rounded text-[10px] font-mono border border-slate-200 shadow-2xs">E</kbd>
            <span className="text-[10px] text-slate-400">Move</span>
            <kbd className="px-1.5 py-0.5 bg-white text-slate-800 rounded text-[10px] font-mono border border-slate-200 shadow-2xs">Enter</kbd>
            <span className="text-[10px] text-slate-400">Open</span>
            <kbd className="px-1.5 py-0.5 bg-white text-slate-800 rounded text-[10px] font-mono border border-slate-200 shadow-2xs">Esc</kbd>
            <span className="text-[10px] text-slate-400">Close</span>
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
            <ShieldAlert className={`h-4 w-4 ${rateLimit.remaining < 15 ? 'text-amber-500 animate-pulse' : 'text-emerald-500'}`} />
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-2 text-slate-700 font-medium text-[11px]">
                <span>Rate Limit:</span>
                <span className="font-bold text-slate-900">{rateLimit.remaining}/{rateLimit.limit}</span>
              </div>
              <div className="mt-0.5 h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full transition-all duration-300 ${
                    percentRemaining < 25 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percentRemaining}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {resetMinutes}m
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
