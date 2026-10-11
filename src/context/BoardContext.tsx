import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { GitHubIssue, TriageStage } from '../types';
import { MOCK_ISSUES } from '../data/mockIssues';

export type BoardState = Record<TriageStage, GitHubIssue[]>;

export type BoardAction =
  | { type: 'HYDRATE'; payload: BoardState }
  | { type: 'MOVE_ISSUE'; payload: { issue: GitHubIssue; source?: TriageStage; target: TriageStage } }
  | { type: 'REMOVE_ISSUE'; payload: { issueId: number; stage: TriageStage } }
  | { type: 'ADD_BACKLOG_ISSUES'; payload: GitHubIssue[] };

export const initialBoard: BoardState = {
  backlog: MOCK_ISSUES,
  interested: [],
  investigating: [],
  drafting: [],
  submitted: [],
};

const LOCAL_STORAGE_KEY = 'devpulse_board_state_v1';

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'MOVE_ISSUE': {
      const { issue, target } = action.payload;

      // Remove issue from all 5 stages to prevent duplicates or stuck stage references
      const newState: BoardState = {
        backlog: state.backlog.filter((i) => i.id !== issue.id),
        interested: state.interested.filter((i) => i.id !== issue.id),
        investigating: state.investigating.filter((i) => i.id !== issue.id),
        drafting: state.drafting.filter((i) => i.id !== issue.id),
        submitted: state.submitted.filter((i) => i.id !== issue.id),
      };

      // Add issue to target stage at top of list
      newState[target] = [issue, ...newState[target]];

      return newState;
    }

    case 'REMOVE_ISSUE':
      return {
        ...state,
        [action.payload.stage]: state[action.payload.stage].filter(
          (i) => i.id !== action.payload.issueId
        ),
      };

    case 'ADD_BACKLOG_ISSUES': {
      // Merge new candidate issues without duplicating existing issues on the board
      const existingIds = new Set(
        Object.values(state).flatMap((list) => list.map((i) => i.id))
      );
      const newUnique = action.payload.filter((i) => !existingIds.has(i.id));

      return {
        ...state,
        backlog: [...state.backlog, ...newUnique],
      };
    }

    default:
      return state;
  }
}

interface BoardContextType {
  board: BoardState;
  moveIssue: (issue: GitHubIssue, target: TriageStage) => void;
  removeIssue: (issueId: number, stage: TriageStage) => void;
  addBacklogIssues: (issues: GitHubIssue[]) => void;
}

const BoardContext = createContext<BoardContextType | null>(null);

export const BoardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [board, dispatch] = useReducer(boardReducer, initialBoard, (defaultState) => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as BoardState;
        // Verify all 5 stages exist in parsed object
        if (parsed.backlog && parsed.interested && parsed.investigating && parsed.drafting && parsed.submitted) {
          const existingIds = new Set(
            Object.values(parsed).flatMap((list) => list.map((i) => i.id))
          );
          const missingMocks = MOCK_ISSUES.filter((i) => !existingIds.has(i.id));
          if (missingMocks.length > 0) {
            return {
              ...parsed,
              backlog: [...parsed.backlog, ...missingMocks],
            };
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to hydrate board state from localStorage:', e);
    }
    return defaultState;
  });

  // Sync to localStorage whenever board state updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(board));
    } catch (e) {
      console.warn('Failed to persist board state to localStorage:', e);
    }
  }, [board]);

  const moveIssue = (issue: GitHubIssue, target: TriageStage) => {
    dispatch({ type: 'MOVE_ISSUE', payload: { issue, target } });
  };

  const removeIssue = (issueId: number, stage: TriageStage) => {
    dispatch({ type: 'REMOVE_ISSUE', payload: { issueId, stage } });
  };

  const addBacklogIssues = (issues: GitHubIssue[]) => {
    dispatch({ type: 'ADD_BACKLOG_ISSUES', payload: issues });
  };

  return (
    <BoardContext.Provider value={{ board, moveIssue, removeIssue, addBacklogIssues }}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be used within BoardProvider');
  return ctx;
};
