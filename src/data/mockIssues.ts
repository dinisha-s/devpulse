import type { GitHubIssue } from '../types';

export const MOCK_ISSUES: GitHubIssue[] = [
  {
    id: 12048,
    node_id: 'I_kwDOA12048',
    number: 12048,
    title: 'Fix hydration mismatch when using React 19 Server Components with dynamic inline scripts',
    body: `### Context
When rendering dynamic inline scripts inside a React 19 Server Component, the hydration step on the client raises a warning:
\`Text content does not match server-rendered HTML.\`

### Steps to Reproduce
1. Create a RSC page returning \`<script dangerouslySetInnerHTML={{ __html: 'window.__INIT__=true;' }} />\`
2. Load page in browser with dev tools open.

### Expected Behavior
Inline script should hydrate without raising DOM mismatch warnings.

### Possible Fix
Wrap script injection in a client boundary or pass nonce attribute correctly during server streaming.`,
    html_url: 'https://github.com/vercel/next.js/issues/12048',
    state: 'open',
    comments: 14,
    created_at: '2026-09-25T10:30:00Z',
    updated_at: '2026-09-28T14:20:00Z',
    labels: [
      { id: 1, name: 'good first issue', color: '70c24a', description: 'Good for newcomers' },
      { id: 2, name: 'area: RSC', color: '0075ca', description: 'React Server Components' },
      { id: 3, name: 'kind: bug', color: 'd73a4a', description: 'Bug fix needed' },
    ],
    repository: {
      name: 'next.js',
      full_name: 'vercel/next.js',
      owner: {
        login: 'vercel',
        avatar_url: 'https://avatars.githubusercontent.com/u/14985020?v=4',
      },
      stargazers_count: 124500,
      language: 'TypeScript',
    },
    complexityScore: 'Quick Fix (< 1h)',
  },
  {
    id: 4392,
    node_id: 'I_kwDOB4392',
    number: 4392,
    title: 'Support custom Auth headers in realtime WebSockets subscriber client',
    body: `### Description
Currently, the realtime websocket client uses the standard API key header. We need to support custom authorization bearer tokens passed via configuration options.

### Code snippet
\`\`\`typescript
const client = createClient(URL, KEY, {
  realtime: {
    headers: { Authorization: 'Bearer custom_token' }
  }
})
\`\`\`

### Impact
High community demand for enterprise OAuth proxy flows.`,
    html_url: 'https://github.com/supabase/supabase/issues/4392',
    state: 'open',
    comments: 8,
    created_at: '2026-09-20T08:15:00Z',
    updated_at: '2026-09-27T11:10:00Z',
    labels: [
      { id: 4, name: 'help wanted', color: '008672', description: 'Extra hands appreciated' },
      { id: 5, name: 'feature request', color: 'a2eeef', description: 'New capability' },
    ],
    repository: {
      name: 'supabase',
      full_name: 'supabase/supabase',
      owner: {
        login: 'supabase',
        avatar_url: 'https://avatars.githubusercontent.com/u/54469796?v=4',
      },
      stargazers_count: 76200,
      language: 'TypeScript',
    },
    complexityScore: 'Moderate (1-3h)',
  },
  {
    id: 8819,
    node_id: 'I_kwDOC8819',
    number: 8819,
    title: 'Tailwind v4 CLI fails to parse CSS variables inside @container queries',
    body: `### Problem
Using CSS variable custom values inside container query breakpoints triggers a parser error in the CLI compiler:

\`\`\`css
@container (min-width: var(--sidebar-width)) {
  .sidebar-content { display: block; }
}
\`\`\`

### Solution
Update PostCSS AST visitor to defer variable resolution during container rule inspection.`,
    html_url: 'https://github.com/tailwindlabs/tailwindcss/issues/8819',
    state: 'open',
    comments: 21,
    created_at: '2026-09-15T16:45:00Z',
    updated_at: '2026-09-29T09:00:00Z',
    labels: [
      { id: 6, name: 'good first issue', color: '70c24a', description: 'Beginner friendly' },
      { id: 7, name: 'cli', color: 'e99695', description: 'CLI package' },
    ],
    repository: {
      name: 'tailwindcss',
      full_name: 'tailwindlabs/tailwindcss',
      owner: {
        login: 'tailwindlabs',
        avatar_url: 'https://avatars.githubusercontent.com/u/67109815?v=4',
      },
      stargazers_count: 83100,
      language: 'Rust',
    },
    complexityScore: 'Deep Dive (4h+)',
  },
  {
    id: 3104,
    node_id: 'I_kwDOD3104',
    number: 3104,
    title: 'Add TypeScript generics to useActionState hook response tuple',
    body: `### Feature Request
Provide strong typing for action return payloads when using \`useActionState(fn, initialState)\`.

Currently returns \`[any, (payload: FormData) => void, boolean]\`.

Should allow inferring return type from \`fn\`.`,
    html_url: 'https://github.com/facebook/react/issues/3104',
    state: 'open',
    comments: 32,
    created_at: '2026-09-22T19:00:00Z',
    updated_at: '2026-09-29T18:30:00Z',
    labels: [
      { id: 8, name: 'type: typings', color: 'fef2c0', description: 'TypeScript definitions' },
      { id: 9, name: 'help wanted', color: '008672', description: 'Contributions welcome' },
    ],
    repository: {
      name: 'react',
      full_name: 'facebook/react',
      owner: {
        login: 'facebook',
        avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
      },
      stargazers_count: 228000,
      language: 'JavaScript',
    },
    complexityScore: 'Quick Fix (< 1h)',
  },
  {
    id: 9821,
    node_id: 'I_kwDOE9821',
    number: 9821,
    title: 'Fix Pydantic v2 ValidationError serialization when returning custom response models in async endpoints',
    body: `### Description
When returning a Pydantic v2 model with custom validator field decorators inside an async FastAPI route, the response JSON serializer throws an unhandled AttributeError: 'tuple' object has no attribute 'dict'.

### Steps to Reproduce
1. Define a FastAPI route returning a custom Pydantic v2 model.
2. Trigger a validation error during response serialization.

### Expected Behavior
FastAPI should catch the Pydantic ValidationError and return a clean 422 Unprocessable Entity response.

### Suggested Entrypoint
Inspect \`fastapi/routing.py\` inside \`serialize_response()\`.`,
    html_url: 'https://github.com/fastapi/fastapi/issues/9821',
    state: 'open',
    comments: 18,
    created_at: '2026-09-24T12:00:00Z',
    updated_at: '2026-09-29T15:10:00Z',
    labels: [
      { id: 10, name: 'good first issue', color: '70c24a', description: 'Good for newcomers' },
      { id: 11, name: 'kind: bug', color: 'd73a4a', description: 'Bug fix needed' },
    ],
    repository: {
      name: 'fastapi',
      full_name: 'fastapi/fastapi',
      owner: {
        login: 'fastapi',
        avatar_url: 'https://avatars.githubusercontent.com/u/13645398?v=4',
      },
      stargazers_count: 78900,
      language: 'Python',
    },
    complexityScore: 'Quick Fix (< 1h)',
  },
  {
    id: 6420,
    node_id: 'I_kwDOF6420',
    number: 6420,
    title: 'Add retry logic for HTTP 429 Too Many Requests in HTTPAdapter connection pool',
    body: `### Problem
The default HTTPAdapter does not automatically handle rate-limiting (HTTP 429) responses during connection pooling retries.

### Proposed Solution
Add \`status_forcelist=[429]\` as a default configurable option in \`urllib3.util.retry.Retry\` within \`requests/adapters.py\`.

### Impact
Improves resilience for API integration services hitting rate limits.`,
    html_url: 'https://github.com/psf/requests/issues/6420',
    state: 'open',
    comments: 12,
    created_at: '2026-09-21T09:30:00Z',
    updated_at: '2026-09-28T16:40:00Z',
    labels: [
      { id: 12, name: 'help wanted', color: '008672', description: 'Extra hands appreciated' },
      { id: 13, name: 'good first issue', color: '70c24a', description: 'Beginner friendly' },
    ],
    repository: {
      name: 'requests',
      full_name: 'psf/requests',
      owner: {
        login: 'psf',
        avatar_url: 'https://avatars.githubusercontent.com/u/4155?v=4',
      },
      stargazers_count: 51200,
      language: 'Python',
    },
    complexityScore: 'Moderate (1-3h)',
  },
];
