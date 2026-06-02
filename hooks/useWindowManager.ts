'use client';

import { useState, useCallback } from 'react';
import { WindowManagerState, WindowState, ActiveWindow } from '@/lib/types';
import { DEFAULT_WINDOW_STATE } from '@/lib/constants';

export function useWindowManager() {
  const [state, setState] = useState<WindowManagerState>(DEFAULT_WINDOW_STATE);

  const setMainState = useCallback((s: WindowState) => {
    setState(prev => ({
      ...prev,
      main: s,
      active: s === 'open' || s === 'maximized' ? 'main' : prev.active,
    }));
  }, []);

  const setConsoleState = useCallback((s: WindowState) => {
    setState(prev => ({
      ...prev,
      console: s,
      active: s === 'open' || s === 'maximized'
        ? 'console'
        : (prev.main === 'open' || prev.main === 'maximized' ? 'main' : prev.active),
    }));
  }, []);

  const openConsole = useCallback(() => {
    setState(prev => ({
      ...prev,
      main: prev.main === 'maximized' ? 'open' : prev.main,
      console: 'open',
      active: 'console',
    }));
  }, []);

  const focusWindow = useCallback((win: Exclude<ActiveWindow, null>) => {
    setState(prev => ({ ...prev, active: win }));
  }, []);

  const bothClosed = state.main === 'closed' && state.console === 'closed';

  return {
    ...state,
    setMainState,
    setConsoleState,
    openConsole,
    focusWindow,
    bothClosed,
  };
}
