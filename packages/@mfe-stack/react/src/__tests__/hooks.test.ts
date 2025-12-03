import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBridge } from '../use-bridge.js';
import { useBridgeState } from '../use-bridge-state.js';
import { useBridgeAction } from '../use-bridge-action.js';
import type { Bridge } from '@mfe-stack/core';

// Create a mock bridge factory
function createMockBridge<T>(initialState: T): Bridge<T> & { _listeners: Set<() => void> } {
  let state = initialState;
  const listeners = new Set<() => void>();
  const keyListeners = new Map<keyof T, Set<() => void>>();

  return {
    _listeners: listeners,
    getState: () => state,
    setState: (updater: Partial<T> | ((prev: T) => Partial<T>)) => {
      const updates = typeof updater === 'function' ? updater(state) : updater;
      state = { ...state, ...updates };
      listeners.forEach((l) => l());
      Object.keys(updates).forEach((key) => {
        const keySet = keyListeners.get(key as keyof T);
        if (keySet) {
          keySet.forEach((l) => l());
        }
      });
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    subscribeKey: <K extends keyof T>(key: K, listener: () => void) => {
      if (!keyListeners.has(key)) {
        keyListeners.set(key, new Set());
      }
      keyListeners.get(key)!.add(listener);
      return () => keyListeners.get(key)?.delete(listener);
    },
    dispatch: vi.fn(),
    onAction: vi.fn(() => () => {}),
    destroy: vi.fn(),
  };
}

interface TestState {
  count: number;
  name: string;
  items: string[];
}

describe('React hooks', () => {
  let mockBridge: ReturnType<typeof createMockBridge<TestState>>;

  beforeEach(() => {
    mockBridge = createMockBridge<TestState>({
      count: 0,
      name: 'test',
      items: [],
    });
  });

  describe('useBridge', () => {
    it('should return current state', () => {
      const { result } = renderHook(() => useBridge(mockBridge));

      expect(result.current).toEqual({
        count: 0,
        name: 'test',
        items: [],
      });
    });

    it('should update when state changes', () => {
      const { result } = renderHook(() => useBridge(mockBridge));

      expect(result.current.count).toBe(0);

      act(() => {
        mockBridge.setState({ count: 5 });
      });

      expect(result.current.count).toBe(5);
    });

    it('should subscribe on mount', () => {
      expect(mockBridge._listeners.size).toBe(0);

      renderHook(() => useBridge(mockBridge));

      expect(mockBridge._listeners.size).toBe(1);
    });

    it('should unsubscribe on unmount', () => {
      const { unmount } = renderHook(() => useBridge(mockBridge));

      expect(mockBridge._listeners.size).toBe(1);

      unmount();

      expect(mockBridge._listeners.size).toBe(0);
    });

    it('should handle multiple state updates', () => {
      const { result } = renderHook(() => useBridge(mockBridge));

      act(() => {
        mockBridge.setState({ count: 1 });
        mockBridge.setState({ count: 2 });
        mockBridge.setState({ count: 3 });
      });

      expect(result.current.count).toBe(3);
    });
  });

  describe('useBridgeState', () => {
    it('should return specific key value', () => {
      const { result } = renderHook(() => useBridgeState(mockBridge, 'count'));

      expect(result.current).toBe(0);
    });

    it('should update when specific key changes', () => {
      const { result } = renderHook(() => useBridgeState(mockBridge, 'count'));

      act(() => {
        mockBridge.setState({ count: 10 });
      });

      expect(result.current).toBe(10);
    });

    it('should return array values correctly', () => {
      const { result } = renderHook(() => useBridgeState(mockBridge, 'items'));

      expect(result.current).toEqual([]);

      act(() => {
        mockBridge.setState({ items: ['a', 'b', 'c'] });
      });

      expect(result.current).toEqual(['a', 'b', 'c']);
    });

    it('should return string values correctly', () => {
      const { result } = renderHook(() => useBridgeState(mockBridge, 'name'));

      expect(result.current).toBe('test');

      act(() => {
        mockBridge.setState({ name: 'updated' });
      });

      expect(result.current).toBe('updated');
    });
  });

  describe('useBridgeAction', () => {
    it('should return a dispatch function', () => {
      const { result } = renderHook(() => useBridgeAction(mockBridge));

      expect(typeof result.current).toBe('function');
    });

    it('should call bridge.dispatch with action and payload', () => {
      const { result } = renderHook(() => useBridgeAction(mockBridge));

      act(() => {
        result.current('ADD_ITEM', { id: '123', name: 'Product' });
      });

      expect(mockBridge.dispatch).toHaveBeenCalledWith('ADD_ITEM', {
        id: '123',
        name: 'Product',
      });
    });

    it('should call bridge.dispatch without payload', () => {
      const { result } = renderHook(() => useBridgeAction(mockBridge));

      act(() => {
        result.current('CLEAR_ALL');
      });

      expect(mockBridge.dispatch).toHaveBeenCalledWith('CLEAR_ALL', undefined);
    });

    it('should return stable dispatch function', () => {
      const { result, rerender } = renderHook(() => useBridgeAction(mockBridge));

      const firstDispatch = result.current;

      rerender();

      expect(result.current).toBe(firstDispatch);
    });
  });
});
