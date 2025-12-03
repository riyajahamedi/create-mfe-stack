import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, config } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { useBridge } from '../use-bridge.js';
import { useBridgeState } from '../use-bridge-state.js';
import type { Bridge } from '@mfe-stack/core';

// Suppress Vue warnings in tests
config.global.config.warnHandler = () => {};

// Create a mock bridge factory
function createMockBridge<T>(initialState: T): Bridge<T> & {
  _listeners: Set<(state: T, prevState: T) => void>;
  _keyListeners: Map<keyof T, Set<(value: unknown, prevValue: unknown) => void>>;
} {
  let state = initialState;
  const listeners = new Set<(state: T, prevState: T) => void>();
  const keyListeners = new Map<keyof T, Set<(value: unknown, prevValue: unknown) => void>>();

  return {
    _listeners: listeners,
    _keyListeners: keyListeners,
    getState: () => state,
    setState: (updater: Partial<T> | ((prev: T) => Partial<T>)) => {
      const prevState = state;
      const updates = typeof updater === 'function' ? updater(state) : updater;
      state = { ...state, ...updates };
      listeners.forEach((l) => l(state, prevState));
      Object.keys(updates).forEach((key) => {
        const keySet = keyListeners.get(key as keyof T);
        if (keySet) {
          const k = key as keyof T;
          keySet.forEach((l) => l(state[k], prevState[k]));
        }
      });
    },
    subscribe: (listener: (state: T, prevState: T) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    subscribeKey: <K extends keyof T>(
      key: K,
      listener: (value: T[K], prevValue: T[K]) => void
    ) => {
      if (!keyListeners.has(key)) {
        keyListeners.set(key, new Set());
      }
      keyListeners.get(key)!.add(listener as (value: unknown, prevValue: unknown) => void);
      return () => keyListeners.get(key)?.delete(listener as (value: unknown, prevValue: unknown) => void);
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

describe('Vue composables', () => {
  let mockBridge: ReturnType<typeof createMockBridge<TestState>>;

  beforeEach(() => {
    mockBridge = createMockBridge<TestState>({
      count: 0,
      name: 'test',
      items: [],
    });
  });

  describe('useBridge', () => {
    it('should return reactive state ref', () => {
      const TestComponent = defineComponent({
        setup() {
          const state = useBridge(mockBridge);
          return { state };
        },
        render() {
          return h('div', `count: ${this.state.count}`);
        },
      });

      const wrapper = mount(TestComponent);
      expect(wrapper.text()).toBe('count: 0');
    });

    it('should update when state changes', async () => {
      const TestComponent = defineComponent({
        setup() {
          const state = useBridge(mockBridge);
          return { state };
        },
        render() {
          return h('div', `count: ${this.state.count}`);
        },
      });

      const wrapper = mount(TestComponent);
      expect(wrapper.text()).toBe('count: 0');

      mockBridge.setState({ count: 5 });
      await nextTick();

      expect(wrapper.text()).toBe('count: 5');
    });

    it('should subscribe on mount', () => {
      const TestComponent = defineComponent({
        setup() {
          const state = useBridge(mockBridge);
          return { state };
        },
        render() {
          return h('div');
        },
      });

      expect(mockBridge._listeners.size).toBe(0);
      mount(TestComponent);
      expect(mockBridge._listeners.size).toBe(1);
    });

    it('should unsubscribe on unmount', () => {
      const TestComponent = defineComponent({
        setup() {
          const state = useBridge(mockBridge);
          return { state };
        },
        render() {
          return h('div');
        },
      });

      const wrapper = mount(TestComponent);
      expect(mockBridge._listeners.size).toBe(1);

      wrapper.unmount();
      expect(mockBridge._listeners.size).toBe(0);
    });

    it('should handle object state correctly', async () => {
      const TestComponent = defineComponent({
        setup() {
          const state = useBridge(mockBridge);
          return { state };
        },
        render() {
          return h('div', [
            h('span', { class: 'count' }, `count: ${this.state.count}`),
            h('span', { class: 'name' }, `name: ${this.state.name}`),
          ]);
        },
      });

      const wrapper = mount(TestComponent);
      expect(wrapper.find('.count').text()).toBe('count: 0');
      expect(wrapper.find('.name').text()).toBe('name: test');

      mockBridge.setState({ count: 10, name: 'updated' });
      await nextTick();

      expect(wrapper.find('.count').text()).toBe('count: 10');
      expect(wrapper.find('.name').text()).toBe('name: updated');
    });
  });

  describe('useBridgeState', () => {
    it('should return reactive ref for specific key', () => {
      const TestComponent = defineComponent({
        setup() {
          const count = useBridgeState(mockBridge, 'count');
          return { count };
        },
        render() {
          return h('div', `count: ${this.count}`);
        },
      });

      const wrapper = mount(TestComponent);
      expect(wrapper.text()).toBe('count: 0');
    });

    it('should update when key changes', async () => {
      const TestComponent = defineComponent({
        setup() {
          const count = useBridgeState(mockBridge, 'count');
          return { count };
        },
        render() {
          return h('div', `count: ${this.count}`);
        },
      });

      const wrapper = mount(TestComponent);
      expect(wrapper.text()).toBe('count: 0');

      mockBridge.setState({ count: 42 });
      await nextTick();

      expect(wrapper.text()).toBe('count: 42');
    });

    it('should handle array values', async () => {
      const TestComponent = defineComponent({
        setup() {
          const items = useBridgeState(mockBridge, 'items');
          return { items };
        },
        render() {
          return h('div', `items:${this.items.length > 0 ? ' ' + this.items.join(', ') : ''}`);
        },
      });

      const wrapper = mount(TestComponent);
      expect(wrapper.text()).toBe('items:');

      mockBridge.setState({ items: ['a', 'b', 'c'] });
      await nextTick();

      expect(wrapper.text()).toBe('items: a, b, c');
    });

    it('should subscribe to key on mount', () => {
      const TestComponent = defineComponent({
        setup() {
          const count = useBridgeState(mockBridge, 'count');
          return { count };
        },
        render() {
          return h('div');
        },
      });

      expect(mockBridge._keyListeners.size).toBe(0);
      mount(TestComponent);
      expect(mockBridge._keyListeners.has('count')).toBe(true);
    });

    it('should unsubscribe from key on unmount', () => {
      const TestComponent = defineComponent({
        setup() {
          const count = useBridgeState(mockBridge, 'count');
          return { count };
        },
        render() {
          return h('div');
        },
      });

      const wrapper = mount(TestComponent);
      expect(mockBridge._keyListeners.get('count')?.size).toBe(1);

      wrapper.unmount();
      expect(mockBridge._keyListeners.get('count')?.size).toBe(0);
    });
  });
});
