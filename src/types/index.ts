/**
 * Represents the 5 Kanban workflow stages for issue triage.
 */
export type TriageStage =
  | 'backlog'
  | 'interested'
  | 'investigating'
  | 'drafting'
  | 'submitted';

/**
 * Represents label metadata returned by GitHub REST API.
 */
export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description?: string;
}

/**
 * Minimal owner details for repository.
 */
export interface GitHubOwner {
  login: string;
  avatar_url: string;
}

/**
 * Minimal repository details associated with an issue.
 */
export interface GitHubRepository {
  name: string;
  full_name: string;
  owner: GitHubOwner;
  stargazers_count: number;
  language: string | null;
}

/**
 * Estimated difficulty/time required for triaging/fixing the issue.
 */
export type ComplexityScore =
  | 'Quick Fix (< 1h)'
  | 'Moderate (1-3h)'
  | 'Deep Dive (4h+)';

/**
 * Core GitHub Issue entity model.
 */
export interface GitHubIssue {
  id: number;
  node_id: string;
  number: number;
  title: string;
  body: string;
  html_url: string;
  state: 'open' | 'closed';
  comments: number;
  created_at: string;
  updated_at: string;
  labels: GitHubLabel[];
  repository: GitHubRepository;
  complexityScore?: ComplexityScore;
}

/**
 * Rate limit tracking state extracted from GitHub HTTP response headers.
 */
export interface RateLimitState {
  limit: number;
  remaining: number;
  resetEpoch: number; // UTC timestamp in seconds
}

/**
 * Local Pull Request proposal draft saved by the user for an issue.
 */
export interface PRDraft {
  issueId: number;
  branchName: string;
  problemSummary: string;
  proposedChanges: string;
  testingSteps: string;
  updatedAt?: string;
}

/**
 * Filter parameters for searching GitHub issues in DevPulse.
 */
export interface IssueFilterState {
  searchQuery: string;
  language: string;
  label: string;
  minStars: number;
  onlyGoodFirstIssue: boolean;
}
