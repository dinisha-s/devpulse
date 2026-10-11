import type { GitHubIssue } from '../../types';

export interface AITriageSummary {
  rootProblem: string;
  suggestedEntrypoint: string;
  complexityTier: 'Quick Fix (< 1h)' | 'Moderate (1-3h)' | 'Deep Dive (4h+)';
  onboardingTip: string;
}

/**
 * AI Service for generating 30-second issue triage summaries.
 * Emulates a secure serverless / edge proxy endpoint response.
 */
export async function generateAITriageSummary(
  issue: GitHubIssue
): Promise<AITriageSummary> {
  // Simulate network latency for LLM inference (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Determine intelligent entrypoints based on repository language and title keywords
  const titleLower = issue.title.toLowerCase();
  const repoName = issue.repository.name;
  let entrypoint = 'src/index.ts';
  let tier: AITriageSummary['complexityTier'] = 'Moderate (1-3h)';

  if (titleLower.includes('hydration') || titleLower.includes('rsc') || titleLower.includes('script')) {
    entrypoint = 'packages/next/src/client/app-index.tsx';
    tier = 'Quick Fix (< 1h)';
  } else if (titleLower.includes('auth') || titleLower.includes('header') || titleLower.includes('websocket')) {
    entrypoint = 'packages/realtime-js/src/RealtimeClient.ts';
    tier = 'Moderate (1-3h)';
  } else if (titleLower.includes('container') || titleLower.includes('cli') || titleLower.includes('css')) {
    entrypoint = 'crates/tailwindcss-cli/src/ast/visitor.rs';
    tier = 'Deep Dive (4h+)';
  } else if (titleLower.includes('generic') || titleLower.includes('type') || titleLower.includes('hook')) {
    entrypoint = 'packages/react/src/ReactHooks.js';
    tier = 'Quick Fix (< 1h)';
  } else if (titleLower.includes('pydantic') || titleLower.includes('fastapi') || repoName === 'fastapi') {
    entrypoint = 'fastapi/routing.py';
    tier = 'Quick Fix (< 1h)';
  } else if (titleLower.includes('retry') || titleLower.includes('requests') || repoName === 'requests') {
    entrypoint = 'requests/adapters.py';
    tier = 'Moderate (1-3h)';
  } else if (titleLower.includes('django') || titleLower.includes('orm') || repoName === 'django') {
    entrypoint = 'django/db/models/sql/query.py';
    tier = 'Moderate (1-3h)';
  }

  // Structured summary payload
  return {
    rootProblem: `Issue #${issue.number} in ${repoName}: ${issue.title}. Requires updating internal parameter validation and adding automated regression tests.`,
    suggestedEntrypoint: entrypoint,
    complexityTier: tier,
    onboardingTip: `Start by reading tests in '${entrypoint.replace(/[^/]+\.[a-z]+$/, 'tests/')}' and check related open PRs for background context.`,
  };
}
