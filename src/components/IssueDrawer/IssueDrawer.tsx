import React, { useState } from 'react';
import { X, ExternalLink, GitPullRequest, FileText, Sparkles, Send, Check, Loader2, Code, Zap, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import type { GitHubIssue, PRDraft, TriageStage } from '../../types';
import { generateAITriageSummary, type AITriageSummary } from '../../services/ai/triageService';
import { cn } from '../../utils/cn';

interface IssueDrawerProps {
  issue: GitHubIssue | null;
  onClose: () => void;
  onMoveStage?: (issue: GitHubIssue, targetStage: TriageStage) => void;
  currentStage?: TriageStage;
}

export const IssueDrawer: React.FC<IssueDrawerProps> = ({
  issue,
  onClose,
  onMoveStage,
  currentStage = 'backlog',
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'pr'>('specs');
  const [aiSummary, setAiSummary] = useState<AITriageSummary | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const [prDraft, setPrDraft] = useState<PRDraft>({
    issueId: issue?.id || 0,
    branchName: issue ? `fix/issue-${issue.number}` : '',
    problemSummary: issue ? `Fixes #${issue.number}: ${issue.title}` : '',
    proposedChanges: '- [ ] Added validation check\n- [ ] Updated automated tests',
    testingSteps: '- [ ] Tested locally on Node 20.x\n- [ ] Verified build succeeds',
  });

  if (!issue) return null;

  const handleGenerateSummary = async () => {
    setGeneratingAi(true);
    try {
      const result = await generateAITriageSummary(issue);
      setAiSummary(result);
      // Automatically advance from Interested to Investigating when AI analysis completes
      if (onMoveStage && currentStage === 'interested') {
        onMoveStage(issue, 'investigating');
      }
    } catch (e) {
      console.error('Failed to generate AI summary:', e);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem(`devpulse_draft_${issue.id}`, JSON.stringify(prDraft));
    setSavedNotice(true);
    // Automatically advance to Drafting PR when draft proposal is saved
    if (onMoveStage && (currentStage === 'interested' || currentStage === 'investigating')) {
      onMoveStage(issue, 'drafting');
    }
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`issue-drawer-title-${issue.id}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Drawer Panel */}
      <div className="flex h-full w-full max-w-3xl flex-col border-l border-slate-200 bg-white text-slate-900 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3 min-w-0">
            <span className="rounded-md bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-xs font-mono font-bold text-indigo-700 flex-shrink-0">
              #{issue.number}
            </span>
            <div className="min-w-0">
              <h2 id={`issue-drawer-title-${issue.id}`} className="text-base font-bold text-slate-900 truncate">
                {issue.title}
              </h2>
              <p className="text-xs text-slate-500 font-medium">{issue.repository.full_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-900 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection & Stage Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 bg-white text-xs">
          <div className="flex items-center gap-2" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'specs'}
              onClick={() => setActiveTab('specs')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition',
                activeTab === 'specs'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              <FileText className="h-4 w-4" />
              Issue Specification
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'pr'}
              onClick={() => setActiveTab('pr')}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition',
                activeTab === 'pr'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              <GitPullRequest className="h-4 w-4" />
              PR Proposal Builder
            </button>
          </div>

          {/* Triage Stage Switcher */}
          {onMoveStage && (
            <div className="flex items-center gap-2 font-medium">
              <label htmlFor="triage-stage-select" className="text-slate-500">Stage:</label>
              <select
                id="triage-stage-select"
                value={currentStage}
                onChange={(e) => onMoveStage(issue, e.target.value as TriageStage)}
                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-800 outline-none cursor-pointer font-semibold"
              >
                <option value="backlog">Backlog</option>
                <option value="interested">Interested</option>
                <option value="investigating">Investigating</option>
                <option value="drafting">Drafting PR</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'specs' ? (
            <div className="space-y-6" role="tabpanel">
              {/* Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-slate-500">Repository:</span>{' '}
                    <span className="font-semibold text-slate-900">{issue.repository.full_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Stars:</span>{' '}
                    <span className="text-amber-600 font-bold">{issue.repository.stargazers_count}</span>
                  </div>
                </div>
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition shadow-2xs"
                >
                  View on GitHub <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* AI Triage Card */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    AI Triage Intelligence
                  </div>
                  <button
                    onClick={handleGenerateSummary}
                    disabled={generatingAi}
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-xs disabled:opacity-50"
                  >
                    {generatingAi ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing Issue...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate 30s TL;DR
                      </>
                    )}
                  </button>
                </div>

                {/* AI Summary Content */}
                {aiSummary ? (
                  <div className="mt-4 space-y-4 border-t border-indigo-100 pt-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1.5">
                          <Zap className="h-4 w-4 text-amber-500" />
                          Root Problem
                        </div>
                        <p className="text-slate-800 leading-relaxed font-sans">{aiSummary.rootProblem}</p>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1.5">
                          <Code className="h-4 w-4 text-indigo-600" />
                          Suggested Entrypoint
                        </div>
                        <p className="font-mono text-indigo-600 font-bold text-xs">{aiSummary.suggestedEntrypoint}</p>
                        <div className="mt-2 text-xs text-emerald-700 font-semibold">
                          Tier: {aiSummary.complexityTier}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-4 text-slate-700 flex items-start gap-2.5 font-sans leading-relaxed">
                      <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Onboarding Tip:</strong> {aiSummary.onboardingTip}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 font-sans">
                    Click the action button to pass issue specs through the AI proxy endpoint for entrypoint and root cause extraction.
                  </p>
                )}
              </div>

              {/* Raw Markdown Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Issue Description</h3>
                <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed prose max-w-none text-slate-800">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {issue.body || '*No description provided.*'}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            /* PR Proposal Form Workspace */
            <div className="space-y-5 text-xs font-sans" role="tabpanel">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pull Request Proposal Form</h3>
                {savedNotice && (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold animate-pulse">
                    <Check className="h-4 w-4" /> Saved to local storage!
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="pr-branch-name" className="block text-slate-700 mb-1.5 font-semibold">Branch Name</label>
                <input
                  id="pr-branch-name"
                  type="text"
                  value={prDraft.branchName}
                  onChange={(e) => setPrDraft({ ...prDraft, branchName: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-mono text-xs"
                />
              </div>

              <div>
                <label htmlFor="pr-problem-summary" className="block text-slate-700 mb-1.5 font-semibold">Problem Summary</label>
                <input
                  id="pr-problem-summary"
                  type="text"
                  value={prDraft.problemSummary}
                  onChange={(e) => setPrDraft({ ...prDraft, problemSummary: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs"
                />
              </div>

              <div>
                <label htmlFor="pr-proposed-changes" className="block text-slate-700 mb-1.5 font-semibold">Proposed Changes (Markdown)</label>
                <textarea
                  id="pr-proposed-changes"
                  rows={4}
                  value={prDraft.proposedChanges}
                  onChange={(e) => setPrDraft({ ...prDraft, proposedChanges: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-mono text-xs"
                />
              </div>

              <div>
                <label htmlFor="pr-testing-steps" className="block text-slate-700 mb-1.5 font-semibold">Testing & Verification Steps</label>
                <textarea
                  id="pr-testing-steps"
                  rows={3}
                  value={prDraft.testingSteps}
                  onChange={(e) => setPrDraft({ ...prDraft, testingSteps: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-900 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-mono text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 transition shadow-xs text-xs"
                >
                  <Send className="h-4 w-4" /> Save Draft Proposal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
