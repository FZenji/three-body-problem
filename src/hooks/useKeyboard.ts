'use client';

import { useEffect } from 'react';

export interface KeyboardActions {
  togglePlay: () => void;
  reset: () => void;
  speedUp: () => void;
  speedDown: () => void;
  toggleMute: () => void;
  openModal: () => void;
  setDimension: (dim: '2D' | '3D') => void;
}

export function useKeyboard(actions: KeyboardActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't capture shortcuts when user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          actions.togglePlay();
          break;
        case 'r':
        case 'R':
          actions.reset();
          break;
        case 'ArrowUp':
        case '+':
        case '=':
          e.preventDefault();
          actions.speedUp();
          break;
        case 'ArrowDown':
        case '-':
          e.preventDefault();
          actions.speedDown();
          break;
        case 'm':
        case 'M':
          actions.toggleMute();
          break;
        case '?':
          actions.openModal();
          break;
        case '2':
          actions.setDimension('2D');
          break;
        case '3':
          actions.setDimension('3D');
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actions]);
}
