import { useState, useEffect, useRef, useCallback } from 'react';
import type { GitHubIssue, IssueFilterState } from '../types';
import { fetchGitHubIssues } from '../services/github/api';
import { MOCK_ISSUES } from '../data/mockIssues';

interface UseGitHubIssuesOptions {
  filters: IssueFilterState;
  onExtractRateLimits?: (headers: Headers) => void;
  enabled?: boolean;
}

export function useGitHubIssues({
  filters,
  onExtractRateLimits,
  enabled = true,
}: UseGitHubIssuesOptions) {
  const [issues, setIssues] = useState<GitHubIssue[]>(MOCK_ISSUES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref to hold current AbortController instance
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchIssues = useCallback(async () => {
    if (!enabled) return;

    // Abort previous in-flight request if user is still typing or changing filters
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for current request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const { issues: fetchedIssues, headers } = await fetchGitHubIssues(
        filters,
        controller.signal
      );
      setIssues(fetchedIssues);
      if (onExtractRateLimits) {
        onExtractRateLimits(headers);
      }
    } catch (err: unknown) {
      // Ignore AbortError caused by cancellation
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const message = err instanceof Error ? err.message : 'Failed to fetch issues';
      setError(message);
      // Fallback to mock issues if API fails
      setIssues(MOCK_ISSUES);
    } finally {
      setLoading(false);
    }
  }, [filters, onExtractRateLimits, enabled]);

  // Debounce API requests by 400ms when typing search query
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIssues();
    }, 400);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchIssues]);

  return { issues, loading, error, refetch: fetchIssues };
}
