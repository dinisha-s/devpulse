import { useEffect } from 'react';

export interface HotkeyHandlers {
  onNextIssue?: () => void; // 'j' key
  onPrevIssue?: () => void; // 'k' key
  onMoveInterested?: () => void; // 'e' key
  onOpenDrawer?: () => void; // 'Enter' or 'Space'
  onCloseDrawer?: () => void; // 'Escape'
  onFocusSearch?: () => void; // '/' key
}

/**
 * Custom hook to register global keyboard shortcuts with focus guards for form inputs.
 */
export function useHotkeys(handlers: HotkeyHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;

      // Guard: Do not trigger hotkeys if user is focused inside an input, textarea, select, or editable element
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        // Exception: Escape key should blur input or close drawer even when typing
        if (event.key === 'Escape' && handlers.onCloseDrawer) {
          handlers.onCloseDrawer();
          (target as HTMLElement).blur();
        }
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'j':
          if (handlers.onNextIssue) {
            event.preventDefault();
            handlers.onNextIssue();
          }
          break;

        case 'k':
          if (handlers.onPrevIssue) {
            event.preventDefault();
            handlers.onPrevIssue();
          }
          break;

        case 'e':
          if (handlers.onMoveInterested) {
            event.preventDefault();
            handlers.onMoveInterested();
          }
          break;

        case 'enter':
        case ' ':
          if (handlers.onOpenDrawer) {
            event.preventDefault();
            handlers.onOpenDrawer();
          }
          break;

        case 'escape':
          if (handlers.onCloseDrawer) {
            event.preventDefault();
            handlers.onCloseDrawer();
          }
          break;

        case '/':
          if (handlers.onFocusSearch) {
            event.preventDefault();
            handlers.onFocusSearch();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
}
