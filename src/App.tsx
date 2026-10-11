import { useState, useRef, useCallback } from 'react';
import { Header, type WorkstationView } from './components/Header/Header';
import { FilterBar } from './components/FilterBar/FilterBar';
import { IssueFeed } from './components/IssueFeed/IssueFeed';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { IssueDrawer } from './components/IssueDrawer/IssueDrawer';
import { useBoard } from './context/BoardContext';
import { useGitHubRateLimit } from './hooks/useGitHubRateLimit';
import { useGitHubIssues } from './hooks/useGitHubIssues';
import { useHotkeys } from './hooks/useHotkeys';
import type { GitHubIssue, IssueFilterState, TriageStage } from './types';
import { Layers, Activity, GitPullRequest, ShieldAlert, Cpu, Command } from 'lucide-react';

export function App() {
  const { board, moveIssue } = useBoard();
  const { rateLimit, extractRateLimits } = useGitHubRateLimit();

  // Active Navigation View (board | overview | insights)
  const [activeView, setActiveView] = useState<WorkstationView>('board');

  // Mode toggle for Live GitHub REST API vs Offline Mock Data
  const [isLiveApiMode, setIsLiveApiMode] = useState(false);

  // Search input ref for keyboard focus shortcut ('/')
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search & filter criteria
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<IssueFilterState>({
    searchQuery: '',
    language: '',
    label: '',
    minStars: 0,
    onlyGoodFirstIssue: false,
  });

  // Custom hook for live GitHub API fetching
  const { issues: liveIssues, loading, error, refetch } = useGitHubIssues({
    filters: { ...filters, searchQuery },
    onExtractRateLimits: extractRateLimits,
    enabled: isLiveApiMode,
  });

  // Selected issue index in feed & drawer issue state
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [drawerIssue, setDrawerIssue] = useState<GitHubIssue | null>(null);

  // Active backlog issues array depends on whether Live Mode is toggled
  const currentBacklog = isLiveApiMode ? liveIssues : (board.backlog || []);

  // Filtered issue feed candidates
  const filteredFeed = currentBacklog.filter((issue) => {
    if (
      searchQuery &&
      !issue.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !issue.repository.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (filters.language && issue.repository.language !== filters.language) {
      return false;
    }
    if (filters.minStars > 0 && issue.repository.stargazers_count < filters.minStars) {
      return false;
    }
    if (filters.label && !issue.labels.some((l) => l.name === filters.label)) {
      return false;
    }
    if (
      filters.onlyGoodFirstIssue &&
      !issue.labels.some((l) => l.name.toLowerCase().includes('good first issue'))
    ) {
      return false;
    }
    return true;
  });

  // Keyboard navigation action handlers
  const handleNextIssue = useCallback(() => {
    setSelectedIndex((prev) => (prev < filteredFeed.length - 1 ? prev + 1 : prev));
  }, [filteredFeed.length]);

  const handlePrevIssue = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const handleMoveInterested = useCallback(() => {
    if (filteredFeed.length > 0 && filteredFeed[selectedIndex]) {
      moveIssue(filteredFeed[selectedIndex], 'interested');
    }
  }, [filteredFeed, selectedIndex, moveIssue]);

  const handleOpenDrawer = useCallback(() => {
    if (filteredFeed.length > 0 && filteredFeed[selectedIndex]) {
      setDrawerIssue(filteredFeed[selectedIndex]);
    }
  }, [filteredFeed, selectedIndex]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerIssue(null);
  }, []);

  const handleFocusSearch = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Register workstation global hotkeys
  useHotkeys({
    onNextIssue: handleNextIssue,
    onPrevIssue: handlePrevIssue,
    onMoveInterested: handleMoveInterested,
    onOpenDrawer: handleOpenDrawer,
    onCloseDrawer: handleCloseDrawer,
    onFocusSearch: handleFocusSearch,
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      searchQuery: '',
      language: '',
      label: '',
      minStars: 0,
      onlyGoodFirstIssue: false,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Modern Web Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        rateLimit={rateLimit}
        searchInputRef={searchInputRef}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* 2. Page Welcome & Context Header */}
      <section className="bg-white border-b border-slate-200/80 py-4 shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Developer Engineering Workspace
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Discover open-source GitHub issues, triage candidates through a 5-stage Kanban workflow, write PR proposals, and analyze entrypoints.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg text-slate-600 font-medium">
              <Command className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
              <span className="text-slate-500 font-semibold text-[11px]">Shortcuts:</span>
              <kbd className="px-1.5 py-0.5 bg-white text-slate-800 rounded text-[10px] font-mono border border-slate-200 shadow-2xs">J/K</kbd>
              <kbd className="px-1.5 py-0.5 bg-white text-slate-800 rounded text-[10px] font-mono border border-slate-200 shadow-2xs">E</kbd>
              <kbd className="px-1.5 py-0.5 bg-white text-slate-800 rounded text-[10px] font-mono border border-slate-200 shadow-2xs">Enter</kbd>
              <kbd className="px-1.5 py-0.5 bg-white text-slate-800 rounded text-[10px] font-mono border border-slate-200 shadow-2xs">Esc</kbd>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg font-semibold">
              Workstation Active
            </div>
          </div>
        </div>
      </section>

      {/* 3. Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        totalMatchCount={filteredFeed.length}
        isLiveApiMode={isLiveApiMode}
        onToggleLiveApi={() => setIsLiveApiMode((prev) => !prev)}
        loading={loading}
        error={error}
        onRefresh={refetch}
      />

      {/* 4. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 min-h-0">
        {activeView === 'board' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[580px] h-[calc(100vh-220px)]">
            {/* Left Sidebar: Candidate Issue Feed (4 cols) */}
            <section className="lg:col-span-4 h-full min-w-0">
              <IssueFeed
                issues={filteredFeed}
                selectedIndex={selectedIndex}
                onSelectIssue={(index) => {
                  setSelectedIndex(index);
                  setDrawerIssue(filteredFeed[index]);
                }}
                onMoveIssue={(issue, target) => moveIssue(issue, target)}
              />
            </section>

            {/* Right Main Area: Triage Kanban Workflow Board (8 cols) */}
            <section className="lg:col-span-8 h-full min-w-0">
              <KanbanBoard
                board={board}
                onSelectIssue={(issue) => setDrawerIssue(issue)}
                onMoveIssue={(issue, _, target) => moveIssue(issue, target)}
              />
            </section>
          </div>
        )}

        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* Metric Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                  <span>BACKLOG CANDIDATES</span>
                  <Layers className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900">{filteredFeed.length}</div>
                <div className="text-xs text-slate-500 mt-1">Matching active filter criteria</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                  <span>INTERESTED & ACTIVE</span>
                  <GitPullRequest className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {(board.interested?.length || 0) + (board.investigating?.length || 0)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Issues undergoing triage investigation</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                  <span>PRs DRAFTED / SUBMITTED</span>
                  <Activity className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-emerald-600">
                  {(board.drafting?.length || 0) + (board.submitted?.length || 0)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Ready or submitted PR proposals</div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                  <span>API RATE LIMIT</span>
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                </div>
                <div className="text-3xl font-bold text-slate-900">{rateLimit.remaining}/{rateLimit.limit}</div>
                <div className="text-xs text-slate-500 mt-1">GitHub REST API quota</div>
              </div>
            </div>

            {/* Focused Issue Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Currently Focused Candidate Issue
              </h3>
              {filteredFeed[selectedIndex] ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-indigo-600 font-bold font-mono">#{filteredFeed[selectedIndex].number}</span>
                    <h4 className="text-base font-semibold text-slate-900 mt-0.5">
                      {filteredFeed[selectedIndex].title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {filteredFeed[selectedIndex].repository.full_name} • {filteredFeed[selectedIndex].repository.language}
                    </p>
                  </div>
                  <button
                    onClick={() => setDrawerIssue(filteredFeed[selectedIndex])}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs"
                  >
                    Open Workspace Drawer
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No issue currently selected in the feed.</p>
              )}
            </div>
          </div>
        )}

        {activeView === 'insights' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 text-indigo-900 font-bold text-base">
                <Cpu className="h-6 w-6 text-purple-600" />
                AI Triage Intelligence & Entrypoint Analysis
              </div>
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                DevPulse uses a serverless proxy pattern for LLM-powered 30-second issue summaries. This architecture guarantees secret API keys remain safe on the backend while providing structured entrypoints and root cause explanations.
              </p>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Workflow Usage Guide:</h4>
                <ol className="list-decimal list-inside text-xs text-slate-600 space-y-2 leading-relaxed">
                  <li>Select any candidate issue from the Triage Board or Feed.</li>
                  <li>Press <kbd className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono">Enter</kbd> to open the detail workspace drawer.</li>
                  <li>Click <strong>"Generate 30s TL;DR"</strong> to extract root problems, suggested entrypoint files, and contributor tips.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 6. Issue Detail & PR Proposal Drawer */}
      {drawerIssue && (
        <IssueDrawer
          issue={drawerIssue}
          onClose={() => setDrawerIssue(null)}
          onMoveStage={(issue, target) => moveIssue(issue, target)}
          currentStage={
            (Object.entries(board).find(([_, list]) =>
              list.some((i) => i.id === drawerIssue.id)
            )?.[0] as TriageStage) || 'backlog'
          }
        />
      )}
    </div>
  );
}

export default App;