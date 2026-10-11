import React from 'react';
import { LayoutGrid } from 'lucide-react';
import type { GitHubIssue, TriageStage } from '../../types';
import { KanbanColumn } from '../KanbanColumn/KanbanColumn';

type BoardState = Record<TriageStage, GitHubIssue[]>;

interface KanbanBoardProps {
  board: BoardState;
  onSelectIssue: (issue: GitHubIssue) => void;
  onMoveIssue: (issue: GitHubIssue, source: TriageStage, target: TriageStage) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  board,
  onSelectIssue,
  onMoveIssue,
}) => {
  const columns: { title: string; stage: TriageStage; color: string; badgeBg: string }[] = [
    { title: 'Interested', stage: 'interested', color: 'bg-sky-500', badgeBg: 'bg-sky-50 text-sky-700 border border-sky-200' },
    { title: 'Investigating', stage: 'investigating', color: 'bg-amber-500', badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200' },
    { title: 'Drafting PR', stage: 'drafting', color: 'bg-purple-500', badgeBg: 'bg-purple-50 text-purple-700 border border-purple-200' },
    { title: 'Submitted', stage: 'submitted', color: 'bg-emerald-500', badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  ];

  return (
    <div className="flex h-full w-full min-w-0 flex-col border border-slate-200 bg-white rounded-xl shadow-xs overflow-hidden">
      {/* Board Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3 bg-slate-50/80 gap-3 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <LayoutGrid className="h-4 w-4 text-purple-600 flex-shrink-0" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate">
            Triage Workflow Board
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium truncate hidden md:inline flex-shrink-0">
          Click any card to open issue specs & PR proposal workspace
        </span>
      </div>

      {/* Columns Area */}
      <div className="flex-1 overflow-x-auto p-4 bg-slate-50/30 min-h-0 min-w-0">
        <div className="grid grid-cols-4 gap-4 h-full min-w-[800px]">
          {columns.map((col) => (
            <KanbanColumn
              key={col.stage}
              title={col.title}
              stage={col.stage}
              issues={board[col.stage] || []}
              color={col.color}
              badgeBg={col.badgeBg}
              onSelectIssue={onSelectIssue}
              onMoveIssue={onMoveIssue}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
