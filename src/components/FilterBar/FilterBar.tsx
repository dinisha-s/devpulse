import React from 'react';
import { Filter, Star, Tag, Code2, RotateCcw, Sparkles, Globe, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import type { IssueFilterState } from '../../types';

interface FilterBarProps {
  filters: IssueFilterState;
  onFilterChange: (newFilters: IssueFilterState) => void;
  onReset: () => void;
  totalMatchCount: number;
  isLiveApiMode: boolean;
  onToggleLiveApi: () => void;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalMatchCount,
  isLiveApiMode,
  onToggleLiveApi,
  loading = false,
  error = null,
  onRefresh,
}) => {
  return (
    <div className="bg-white border-b border-slate-200/80 text-xs">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 mr-1">
            <Filter className="h-4 w-4 text-indigo-600" />
            <span>Filters:</span>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 focus-within:border-indigo-500 focus-within:bg-white transition">
            <Code2 className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filters.language}
              onChange={(e) => onFilterChange({ ...filters, language: e.target.value })}
              className="bg-transparent text-slate-800 outline-none font-medium cursor-pointer"
            >
              <option value="">All Languages</option>
              <option value="TypeScript">TypeScript</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Rust">Rust</option>
              <option value="Python">Python</option>
              <option value="Go">Go</option>
            </select>
          </div>

          {/* Stars Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 focus-within:border-indigo-500 focus-within:bg-white transition">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            <select
              value={filters.minStars}
              onChange={(e) => onFilterChange({ ...filters, minStars: Number(e.target.value) })}
              className="bg-transparent text-slate-800 outline-none font-medium cursor-pointer"
            >
              <option value={0}>Any Stars</option>
              <option value={1000}>&gt; 1,000 ⭐</option>
              <option value={10000}>&gt; 10,000 ⭐</option>
              <option value={50000}>&gt; 50,000 ⭐</option>
            </select>
          </div>

          {/* Label Tag Filter */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 focus-within:border-indigo-500 focus-within:bg-white transition">
            <Tag className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filters.label}
              onChange={(e) => onFilterChange({ ...filters, label: e.target.value })}
              className="bg-transparent text-slate-800 outline-none font-medium cursor-pointer"
            >
              <option value="">All Labels</option>
              <option value="good first issue">good first issue</option>
              <option value="help wanted">help wanted</option>
              <option value="kind: bug">kind: bug</option>
              <option value="documentation">documentation</option>
            </select>
          </div>

          {/* Good First Issue Quick Toggle */}
          <button
            onClick={() =>
              onFilterChange({
                ...filters,
                onlyGoodFirstIssue: !filters.onlyGoodFirstIssue,
              })
            }
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition ${
              filters.onlyGoodFirstIssue
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-2xs'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Good First Issue Only</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition px-2 py-1"
            title="Reset filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-4">
          {isLiveApiMode && onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition font-medium"
              title="Refresh live GitHub issues"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
              <span>Sync Live</span>
            </button>
          )}

          <button
            onClick={onToggleLiveApi}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-semibold transition ${
              isLiveApiMode
                ? 'border-indigo-300 bg-indigo-50 text-indigo-700 shadow-2xs'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
            ) : (
              <Globe className={`h-3.5 w-3.5 ${isLiveApiMode ? 'text-indigo-600' : 'text-slate-400'}`} />
            )}
            <span>{isLiveApiMode ? 'Live GitHub REST API' : 'Cached Mock Mode'}</span>
          </button>

          <div className="text-slate-500 font-medium">
            Candidate Issues: <span className="text-indigo-600 font-bold">{totalMatchCount}</span>
          </div>
        </div>
      </div>

      {/* API Error Notification Banner */}
      {error && (
        <div className="bg-amber-50 border-t border-amber-200 px-6 py-2 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <span className="text-amber-600 font-medium">Falling back to cached mock data</span>
        </div>
      )}
    </div>
  );
};
