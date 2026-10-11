import { useState, useCallback } from 'react';
import type { RateLimitState } from '../types';

export function useGitHubRateLimit() {
  const [rateLimit, setRateLimit] = useState<RateLimitState>({
    limit: 60,
    remaining: 60,
    resetEpoch: Math.floor(Date.now() / 1000) + 3600,
  });

  const extractRateLimits = useCallback((headers: Headers) => {
    const limit = headers.get('x-ratelimit-limit');
    const remaining = headers.get('x-ratelimit-remaining');
    const reset = headers.get('x-ratelimit-reset');

    if (limit && remaining && reset) {
      setRateLimit({
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        resetEpoch: parseInt(reset, 10),
      });
    }
  }, []);

  return { rateLimit, setRateLimit, extractRateLimits };
}
