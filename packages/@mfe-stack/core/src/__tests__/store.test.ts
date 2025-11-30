import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createStore } from '../store.js';

describe('createStore', () => {
  it('should create a store', () => {
    const store = createStore();
    expect(store).toBeDefined();
    expect(store.get).toBeDefined();
    expect(store.set).toBeDefined();
    expect(store.delete).toBeDefined();
    expect(store.clear).toBeDefined();
    expect(store.subscribe).toBeDefined();
  });

  describe('get and set', () => {
    it('should set and get values', () => {
      interface TestStore {
        name: string;
        count: number;
      }
      const store = createStore<TestStore>();

      store.set('name', 'test');
      store.set('count', 42);

      expect(store.get('name')).toBe('test');
      expect(store.get('count')).toBe(42);
    });

    it('should return undefined for non-existent keys', () => {
      interface TestStore {
        name: string;
      }
      const store = createStore<TestStore>();

      expect(store.get('name')).toBeUndefined();
    });

    it('should support complex values', () => {
      interface TestStore {
        user: { id: string; name: string } | null;
        items: string[];
      }
      const store = createStore<TestStore>();

      store.set('user', { id: '123', name: 'John' });
      store.set('items', ['a', 'b', 'c']);

      expect(store.get('user')).toEqual({ id: '123', name: 'John' });
      expect(store.get('items')).toEqual(['a', 'b', 'c']);
    });
  });

  describe('delete', () => {
    it('should delete a key', () => {
      interface TestStore {
        name: string;
      }
      const store = createStore<TestStore>();

      store.set('name', 'test');
      expect(store.get('name')).toBe('test');

      store.delete('name');
      expect(store.get('name')).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should clear all keys', () => {
      interface TestStore {
        a: string;
        b: number;
      }
      const store = createStore<TestStore>();

      store.set('a', 'test');
      store.set('b', 42);

      store.clear();

      expect(store.get('a')).toBeUndefined();
      expect(store.get('b')).toBeUndefined();
    });
  });

  describe('subscribe', () => {
    it('should notify subscribers on set', () => {
      interface TestStore {
        name: string;
      }
      const store = createStore<TestStore>();
      const listener = vi.fn();

      store.subscribe('name', listener);
      store.set('name', 'test');

      expect(listener).toHaveBeenCalledWith('test');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should notify subscribers on delete', () => {
      interface TestStore {
        name: string;
      }
      const store = createStore<TestStore>();
      const listener = vi.fn();

      store.set('name', 'test');
      store.subscribe('name', listener);
      store.delete('name');

      expect(listener).toHaveBeenCalledWith(undefined);
    });

    it('should notify subscribers on clear', () => {
      interface TestStore {
        a: string;
        b: number;
      }
      const store = createStore<TestStore>();
      const listenerA = vi.fn();
      const listenerB = vi.fn();

      store.set('a', 'test');
      store.set('b', 42);
      store.subscribe('a', listenerA);
      store.subscribe('b', listenerB);
      store.clear();

      expect(listenerA).toHaveBeenCalledWith(undefined);
      expect(listenerB).toHaveBeenCalledWith(undefined);
    });

    it('should return unsubscribe function', () => {
      interface TestStore {
        name: string;
      }
      const store = createStore<TestStore>();
      const listener = vi.fn();

      const unsubscribe = store.subscribe('name', listener);
      store.set('name', 'first');
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      store.set('name', 'second');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should support multiple subscribers per key', () => {
      interface TestStore {
        name: string;
      }
      const store = createStore<TestStore>();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      store.subscribe('name', listener1);
      store.subscribe('name', listener2);
      store.set('name', 'test');

      expect(listener1).toHaveBeenCalledWith('test');
      expect(listener2).toHaveBeenCalledWith('test');
    });
  });

  describe('persistence', () => {
    const storageKey = '@mfe-stack/test-store';
    let mockStorage: Map<string, string>;

    beforeEach(() => {
      mockStorage = new Map();
      vi.stubGlobal('window', {
        localStorage: {
          getItem: (key: string) => mockStorage.get(key) ?? null,
          setItem: (key: string, value: string) => mockStorage.set(key, value),
          removeItem: (key: string) => mockStorage.delete(key),
        },
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should persist to localStorage when enabled', () => {
      interface TestStore {
        name: string;
      }
      const store = createStore<TestStore>({ persist: true, key: storageKey });

      store.set('name', 'persisted');

      const stored = mockStorage.get(storageKey);
      expect(stored).toBeDefined();
      expect(JSON.parse(stored!)).toEqual({ name: 'persisted' });
    });

    it('should load from localStorage on creation', () => {
      interface TestStore {
        name: string;
        count: number;
      }
      mockStorage.set(storageKey, JSON.stringify({ name: 'loaded', count: 10 }));

      const store = createStore<TestStore>({ persist: true, key: storageKey });

      expect(store.get('name')).toBe('loaded');
      expect(store.get('count')).toBe(10);
    });

    it('should not persist when disabled', () => {
      interface TestStore {
        name: string;
      }
      const store = createStore<TestStore>({ persist: false, key: storageKey });

      store.set('name', 'not-persisted');

      expect(mockStorage.get(storageKey)).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should catch and log errors in listeners', () => {
      interface TestStore {
        name: string;
      }
      const store = createStore<TestStore>();
      const errorListener = vi.fn(() => {
        throw new Error('Listener error');
      });
      const normalListener = vi.fn();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      store.subscribe('name', errorListener);
      store.subscribe('name', normalListener);
      store.set('name', 'test');

      expect(errorListener).toHaveBeenCalled();
      expect(normalListener).toHaveBeenCalledWith('test');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
