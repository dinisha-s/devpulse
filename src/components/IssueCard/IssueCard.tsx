import React from 'react';
import { MessageSquare, Star, ArrowRight, Zap, ExternalLink } from 'lucide-react';
import type { GitHubIssue, TriageStage } from '../../types';
import { cn } from '../../utils/cn';

interface IssueCardProps {
  issue: GitHubIssue;
  isSelected?: boolean;
  onSelect?: () => void;
  onMoveStage?: (target: TriageStage) => void;
  currentStage?: TriageStage;
  compact?: boolean;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  isSelected,
  onSelect,
  onMoveStage,
  currentStage,
  compact = false,
}) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'group relative flex w-full max-w-full min-w-0 flex-shrink-0 flex-col justify-between rounded-xl p-3.5 transition-all duration-150 cursor-pointer light-card overflow-hidden box-border',
        isSelected && 'light-card-selected'
      )}
    >
      {/* Top Header: Repo Avatar, Full Name & Issue Number */}
      <div className="w-full max-w-full min-w-0 overflow-hidden">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2 min-w-0 w-full overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <img
              src={issue.repository.owner.avatar_url}
              alt={issue.repository.owner.login}
              className="h-4 w-4 rounded-full border border-slate-200 flex-shrink-0"
            />
            <span className="truncate font-semibold text-slate-700 min-w-0 flex-1 text-[11px]">
              {issue.repository.full_name}
            </span>
          </div>
          <a
            href={issue.html_url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-indigo-600 transition font-medium flex-shrink-0"
          >
            #{issue.number}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Issue Title */}
        <h3 className={cn(
          "font-semibold text-slate-900 group-hover:text-indigo-600 transition leading-snug break-words min-w-0 mb-2.5 w-full overflow-hidden",
          compact ? "text-xs line-clamp-2" : "text-sm line-clamp-2"
        )}>
          {issue.title}
        </h3>

        {/* Label Tags Container */}
        {issue.labels && issue.labels.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 min-w-0 mb-2.5 w-full overflow-hidden">
            {issue.labels.map((label) => (
              <span
                key={label.id}
                className="inline-flex max-w-full items-center truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium border leading-tight flex-shrink-0"
                style={{
                  backgroundColor: `#${label.color}15`,
                  color: `#${label.color}`,
                  borderColor: `#${label.color}40`,
                }}
                title={label.name}
              >
                <span className="truncate max-w-[140px]">{label.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Footer Metadata & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs text-slate-500 font-medium min-w-0 w-full mt-auto overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="flex items-center gap-1 text-slate-600 flex-shrink-0" title="Comments count">
            <MessageSquare className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-[11px]">{issue.comments}</span>
          </span>
          <span className="flex items-center gap-1 text-slate-600 flex-shrink-0" title="Stargazers count">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20 flex-shrink-0" />
            <span className="text-[11px]">{(issue.repository.stargazers_count / 1000).toFixed(1)}k</span>
          </span>
          {issue.repository.language && (
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700 font-semibold truncate max-w-[80px] flex-shrink-0">
              {issue.repository.language}
            </span>
          )}
        </div>

        {/* Action Button: Quick Triage Transition */}
        {onMoveStage && currentStage === 'backlog' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveStage('interested');
            }}
            className="flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-200 hover:bg-indigo-600 hover:text-white transition shadow-2xs flex-shrink-0"
          >
            <span>Interested</span>
            <ArrowRight className="h-3 w-3 text-current" />
          </button>
        )}

        {issue.complexityScore && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 flex-shrink-0">
            <Zap className="h-3 w-3 text-emerald-600 flex-shrink-0" />
            <span>{issue.complexityScore}</span>
          </span>
        )}
      </div>
    </div>
  );
};
