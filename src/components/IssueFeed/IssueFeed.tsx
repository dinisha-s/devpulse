import React from 'react';
import { Inbox, Compass } from 'lucide-react';
import type { GitHubIssue, TriageStage } from '../../types';
import { IssueCard } from '../IssueCard/IssueCard';

interface IssueFeedProps {
  issues: GitHubIssue[];
  selectedIndex: number;
  onSelectIssue: (index: number) => void;
  onMoveIssue: (issue: GitHubIssue, target: TriageStage) => void;
}

export const IssueFeed: React.FC<IssueFeedProps> = ({
  issues,
  selectedIndex,
  onSelectIssue,
  onMoveIssue,
}) => {
  return (
    <div className="flex h-full w-full min-w-0 flex-col border border-slate-200 bg-white rounded-xl shadow-xs overflow-hidden">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3 bg-slate-50/80 min-w-0 gap-2 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Compass className="h-4 w-4 text-indigo-600 flex-shrink-0" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate">
            Candidate Issues Feed
          </h2>
        </div>
        <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-bold text-indigo-700 flex-shrink-0">
          {issues.length}
        </span>
      </div>

      {/* Feed Scrollable Items - Isolated Stacking List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3.5 bg-slate-50/30 min-w-0 flex flex-col box-border">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-slate-400">
            <Inbox className="h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-600">No matching candidate issues</p>
            <p className="text-xs mt-1 text-slate-400">Adjust filters or search query above.</p>
          </div>
        ) : (
          issues.map((issue, index) => (
            <div key={issue.id} className="w-full max-w-full min-w-0 flex-shrink-0 relative overflow-hidden">
              <IssueCard
                issue={issue}
                isSelected={index === selectedIndex}
                onSelect={() => onSelectIssue(index)}
                onMoveStage={(target) => onMoveIssue(issue, target)}
                currentStage="backlog"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
