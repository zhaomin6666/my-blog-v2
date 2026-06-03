'use client';

import { useState, useCallback } from 'react';
import { WindowManagerState, WindowState, ActiveWindow } from '@/lib/types';
import { DEFAULT_WINDOW_STATE } from '@/lib/constants';

const isVisibleWindow = (s: WindowState) => s === 'open' || s === 'maximized';

export function useWindowManager() {
  const [state, setState] = useState<WindowManagerState>(DEFAULT_WINDOW_STATE);

  const setMainState = useCallback((s: WindowState) => {
    setState(prev => ({
      ...prev,
      main: s,
      active: isVisibleWindow(s)
        ? 'main'
        : (isVisibleWindow(prev.console) ? 'console' : null),
    }));
  }, []);

  const setConsoleState = useCallback((s: WindowState) => {
    setState(prev => ({
      ...prev,
      console: s,
      active: isVisibleWindow(s)
        ? 'console'
        : (isVisibleWindow(prev.main) ? 'main' : null),
    }));
  }, []);

  const openMain = useCallback(() => {
    setState(prev => ({
      ...prev,
      main: isVisibleWindow(prev.main) ? prev.main : 'open',
      console: prev.console === 'maximized' ? 'open' : prev.console,
      active: 'main',
    }));
  }, []);

  const openConsole = useCallback(() => {
    setState(prev => ({
      ...prev,
      console: isVisibleWindow(prev.console) ? prev.console : 'open',
      active: 'console',
    }));
  }, []);

  const openConsoleFromMain = useCallback(() => {
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
    openMain,
    openConsole,
    openConsoleFromMain,
    focusWindow,
    bothClosed,
  };
}
