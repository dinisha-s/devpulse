# DevPulse — High-Density Developer Triage & PR Workstation

DevPulse is a high-density developer productivity workstation designed to discover open-source GitHub issues, triage them through a 5-stage Kanban workflow, prepare pull request (PR) proposals, persist local drafts, and leverage AI enrichment for 30-second issue summaries.

Built with **Vite**, **React 19**, **TypeScript**, **Tailwind CSS v4**, and native React state engines (`useReducer` + `Context API`).

---

## ⚡ Key Features

- **🎯 GitHub Issue Discovery & Live REST API Integration:** Search candidate issues across repositories with multi-criteria filters (language, star threshold, label tags, and `good first issue` filters).
- **📊 5-Stage Kanban Triage Workflow Board:** Optimistically transition issues across `Backlog` ➔ `Interested` ➔ `Investigating` ➔ `Drafting PR` ➔ `Submitted`.
- **🛡️ Rate Limit Resiliency & Live Indicator:** Real-time HTTP header extraction (`x-ratelimit-remaining`, `x-ratelimit-reset`) with automatic fallback to offline cached mock data when rate-limited.
- **⌨️ Keyboard-First Workstation Ergonomics:**
  - `J` / `K` : Navigate next/previous issue down/up the feed.
  - `E` : Quick-move active backlog issue into the *Interested* stage column.
  - `Enter` / `Space` : Pop open the master-detail specification drawer.
  - `Escape` : Dismiss drawer.
  - `/` : Jump focus to the search bar.
- **📝 Split-Pane PR Proposal Builder & Local Autosave:** Write branch names, problem summaries, proposed code changes, and verification steps with `localStorage` autosaving under `devpulse_draft_<issueId>`.
- **🤖 AI Triage TL;DR Enrichment (Serverless Security Model):** One-click LLM issue summaries extracting root problems, candidate entrypoint source files, complexity tiers, and onboarding tips via a secure serverless proxy layer.

---

## 🏗️ Architecture & Data Flow

```text
                     +---------------------------------------+
                     |         DevPulse Client (Vite)        |
                     +---------------------------------------+
                        |         |               |
         useGitHubRateLimit()     |               | useLocalStorage()
                        |         v               v
            +-----------v----+  +---------------+  +------------------+
            | GitHub REST    |  | Board State   |  | Local Drafts &   |
            | Search API     |  | (useReducer)  |  | Board Persistence|
            +----------------+  +---------------+  +------------------+
                        |
                        v (Optional AI Triage Enrichment)
            +---------------------------------------+
            | Serverless / Edge Proxy Function      |
            | -> Issue Summaries & Onboarding Tips  |
            +---------------------------------------+
```

### Unidirectional Data Flow

```text
User Search / Filter Input
      ↓
useGitHubIssues Hook (400ms Debounce + AbortController Cancellation)
      ↓
GitHub Search REST API (https://api.github.com/search/issues)
      ↓
Extract Response Headers (x-ratelimit-*) -> RateLimitState
      ↓
boardReducer (HYDRATE / MOVE_ISSUE / ADD_BACKLOG_ISSUES)
      ↓
BoardContext Provider & localStorage Auto-Sync
      ↓
React UI Component Re-render (IssueFeed | KanbanBoard | IssueDrawer)
```

---

## 🛠️ Tech Stack & Rationale

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Build System** | Vite 8 + React 19 | Lightning-fast HMR and native ES module bundling. |
| **Language** | TypeScript (Strict) | Compile-time safety for API models, props, and reducers (`verbatimModuleSyntax`). |
| **Styling** | Tailwind CSS v4 | High-density desktop workstation aesthetic with custom scrollbars and dark-mode contrast. |
| **Icons** | Lucide React | Accessible vector icons (`GitPullRequest`, `Activity`, `Sparkles`, `Star`). |
| **Markdown** | `react-markdown` + `rehype-highlight` | Renders issue specs & PR proposals safely with code syntax highlighting. |
| **State Engine** | Native `useReducer` + `Context API` | Consolidated, predictable state transitions without heavy external state libraries. |

---

## 📂 Project Structure

```text
devpulse/
├── src/
│   ├── components/
│   │   ├── Header/          # Brand bar, search input, rate limit indicator
│   │   ├── FilterBar/       # Multi-criteria tag filters & Live API toggle
│   │   ├── IssueFeed/       # Candidate issue list feed pane (30% desktop width)
│   │   ├── IssueCard/       # Reusable issue card component
│   │   ├── KanbanBoard/     # 4-stage triage grid view (70% desktop width)
│   │   ├── KanbanColumn/    # Single triage column container
│   │   └── IssueDrawer/     # Master-detail drawer with Specs & PR Proposal tabs
│   │
│   ├── context/
│   │   └── BoardContext.tsx # Central useReducer state engine & local storage sync
│   │
│   ├── hooks/
│   │   ├── useGitHubIssues.ts    # Debounced fetch with AbortController signal
│   │   ├── useGitHubRateLimit.ts # Header parser for rate limits
│   │   ├── useLocalStorage.ts   # Generic localStorage persistence
│   │   └── useHotkeys.ts        # Keyboard shortcuts with form input focus guards
│   │
│   ├── services/
│   │   ├── github/api.ts         # GitHub REST Search API wrapper
│   │   └── ai/triageService.ts   # AI triage TL;DR serverless proxy service
│   │
│   ├── types/
│   │   └── index.ts              # Domain model interfaces & TriageStage union
│   │
│   ├── data/
│   │   └── mockIssues.ts         # Offline fallback mock issues dataset
│   │
│   ├── utils/
│   │   └── cn.ts                 # Classname merge helper (clsx + tailwind-merge)
│   │
│   ├── App.tsx                   # Main workstation layout orchestrator
│   ├── main.tsx                  # Root entrypoint with BoardProvider
│   └── index.css                 # Global CSS imports & scrollbars
│
├── README.md
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🚦 Local Setup & Installation

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/devpulse.git
cd devpulse
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build & Typecheck for Production
```bash
npm run build
```

---

## ⌨️ Keyboard Shortcuts Reference

| Key | Action | Focus Guard Active? |
| :--- | :--- | :---: |
| `J` | Select next issue down in feed | Yes |
| `K` | Select previous issue up in feed | Yes |
| `E` | Quick-move selected issue into **Interested** column | Yes |
| `Enter` / `Space` | Open Issue Specification & PR Proposal drawer | Yes |
| `Escape` | Dismiss active drawer | No (Blurs input) |
| `/` | Focus search bar input | Yes |

---

## 🔒 AI Security Architecture: Why Serverless Proxy?

Placing LLM API keys directly inside frontend React code (`VITE_OPENAI_KEY`) exposes secret keys to end-users via browser DevTools inspection. DevPulse delegates AI summarization requests to a serverless / edge proxy function (`/api/triage`), keeping secret keys secure on the backend while delivering structured JSON summaries to the client.

---

## 📄 License
MIT © 2026 DevPulse Team.
