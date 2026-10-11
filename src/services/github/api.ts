import type { GitHubIssue, IssueFilterState } from '../../types';

export interface GitHubSearchResponse {
  items: RawGitHubIssue[];
  total_count: number;
  incomplete_results: boolean;
}

interface RawGitHubIssue {
  id: number;
  node_id: string;
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  state: 'open' | 'closed';
  comments: number;
  created_at: string;
  updated_at: string;
  labels: { id: number; name: string; color: string; description?: string }[];
  repository_url: string;
}

/**
 * Parses GitHub repository full name (e.g., "owner/repo") from repository_url.
 */
function parseRepoFullName(repositoryUrl: string): { owner: string; name: string; full_name: string } {
  const parts = repositoryUrl.split('/');
  const name = parts[parts.length - 1] || 'unknown';
  const owner = parts[parts.length - 2] || 'unknown';
  return { owner, name, full_name: `${owner}/${name}` };
}

export interface FetchIssuesResult {
  issues: GitHubIssue[];
  headers: Headers;
}

/**
 * Fetches open issues from GitHub Search REST API matching active filter parameters.
 * Uses AbortSignal to prevent race conditions on fast search inputs.
 */
export async function fetchGitHubIssues(
  filters: IssueFilterState,
  signal?: AbortSignal
): Promise<FetchIssuesResult> {
  // Construct GitHub search query terms
  const queryParts: string[] = ['is:issue', 'is:open'];

  if (filters.searchQuery.trim()) {
    queryParts.push(filters.searchQuery.trim());
  }

  if (filters.language) {
    queryParts.push(`language:${filters.language}`);
  }

  if (filters.minStars > 0) {
    queryParts.push(`stars:>${filters.minStars}`);
  }

  if (filters.label) {
    queryParts.push(`label:"${filters.label}"`);
  }

  if (filters.onlyGoodFirstIssue && !filters.label) {
    queryParts.push('label:"good first issue"');
  }

  const q = encodeURIComponent(queryParts.join(' '));
  const url = `https://api.github.com/search/issues?q=${q}&sort=updated&order=desc&per_page=20`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
    signal,
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please wait a few minutes or use cached mock data.');
    }
    throw new Error(`GitHub API request failed with status ${response.status}: ${response.statusText}`);
  }

  const data = (await response.json()) as GitHubSearchResponse;

  // Transform raw GitHub API issues into DevPulse domain model
  const issues: GitHubIssue[] = data.items.map((item) => {
    const { owner, name, full_name } = parseRepoFullName(item.repository_url);

    return {
      id: item.id,
      node_id: item.node_id,
      number: item.number,
      title: item.title,
      body: item.body || '',
      html_url: item.html_url,
      state: item.state,
      comments: item.comments,
      created_at: item.created_at,
      updated_at: item.updated_at,
      labels: item.labels,
      repository: {
        name,
        full_name,
        owner: {
          login: owner,
          avatar_url: `https://github.com/${owner}.png`,
        },
        stargazers_count: filters.minStars > 0 ? filters.minStars : 1200,
        language: filters.language || 'TypeScript',
      },
      complexityScore: item.body && item.body.length > 500 ? 'Moderate (1-3h)' : 'Quick Fix (< 1h)',
    };
  });

  return {
    issues,
    headers: response.headers,
  };
}
