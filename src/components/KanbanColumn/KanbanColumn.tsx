import React from 'react';
import type { GitHubIssue, TriageStage } from '../../types';
import { IssueCard } from '../IssueCard/IssueCard';
import { cn } from '../../utils/cn';

interface KanbanColumnProps {
  title: string;
  stage: TriageStage;
  issues: GitHubIssue[];
  color: string;
  badgeBg: string;
  onSelectIssue: (issue: GitHubIssue) => void;
  onMoveIssue?: (issue: GitHubIssue, source: TriageStage, target: TriageStage) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  stage,
  issues,
  color,
  badgeBg,
  onSelectIssue,
}) => {
  return (
    <div className="flex flex-col h-full w-full min-w-0 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs overflow-hidden box-border">
      {/* Status Column Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3 gap-2 min-w-0 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className={cn('h-2.5 w-2.5 rounded-full flex-shrink-0', color)} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate">
            {title}
          </h3>
        </div>
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold flex-shrink-0', badgeBg)}>
          {issues.length}
        </span>
      </div>

      {/* Column Cards Scrollable Container - Isolated Stacking List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 pr-1 min-w-0 flex flex-col">
        {issues.length === 0 ? (
          <div className="flex items-center justify-center h-28 border-2 border-dashed border-slate-200/60 rounded-lg text-xs font-medium text-slate-400 text-center p-2">
            No active issues in stage
          </div>
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="w-full max-w-full min-w-0 flex-shrink-0 relative overflow-hidden">
              <IssueCard
                issue={issue}
                compact
                onSelect={() => onSelectIssue(issue)}
                currentStage={stage}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
