import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { createBridge } from '../bridge.js';

describe('createBridge', () => {
  const CartSchema = z.object({
    items: z.array(
      z.object({
        id: z.string(),
        quantity: z.number(),
      })
    ),
    total: z.number(),
  });

  it('should create a bridge with initial state', () => {
    const bridge = createBridge({
      namespace: 'cart',
      schema: CartSchema,
      initialState: { items: [], total: 0 },
    });

    expect(bridge.getState()).toEqual({ items: [], total: 0 });
  });

  it('should throw if initial state is invalid', () => {
    expect(() => {
      createBridge({
        namespace: 'cart',
        schema: CartSchema,
        // @ts-expect-error - intentionally invalid
        initialState: { items: 'not an array', total: 0 },
      });
    }).toThrow();
  });

  describe('setState', () => {
    it('should update state with partial object', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      bridge.setState({ total: 100 });
      expect(bridge.getState().total).toBe(100);
      expect(bridge.getState().items).toEqual([]);
    });

    it('should update state with function', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      bridge.setState((prev) => ({
        total: prev.total + 50,
      }));
      expect(bridge.getState().total).toBe(50);
    });

    it('should validate state against schema', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      // Invalid state should throw
      expect(() => {
        // @ts-expect-error - intentionally invalid
        bridge.setState({ total: 'invalid' });
      }).toThrow();
    });

    it('should support adding items', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      bridge.setState({
        items: [{ id: '1', quantity: 2 }],
        total: 50,
      });

      expect(bridge.getState().items).toEqual([{ id: '1', quantity: 2 }]);
      expect(bridge.getState().total).toBe(50);
    });
  });

  describe('subscribe', () => {
    it('should notify subscribers on state change', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      const listener = vi.fn();
      bridge.subscribe(listener);

      bridge.setState({ total: 50 });
      expect(listener).toHaveBeenCalledWith(
        { items: [], total: 50 },
        { items: [], total: 0 }
      );
    });

    it('should return unsubscribe function', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      const listener = vi.fn();
      const unsubscribe = bridge.subscribe(listener);

      bridge.setState({ total: 50 });
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      bridge.setState({ total: 100 });
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribeKey', () => {
    it('should notify on specific key change', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      const listener = vi.fn();
      bridge.subscribeKey('total', listener);

      bridge.setState({ total: 100 });
      expect(listener).toHaveBeenCalledWith(100, 0);
    });

    it('should not notify if key did not change', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      const totalListener = vi.fn();
      bridge.subscribeKey('total', totalListener);

      bridge.setState({ items: [{ id: '1', quantity: 1 }] });
      expect(totalListener).not.toHaveBeenCalled();
    });

    it('should return unsubscribe function', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      const listener = vi.fn();
      const unsubscribe = bridge.subscribeKey('total', listener);

      bridge.setState({ total: 50 });
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      bridge.setState({ total: 100 });
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('dispatch and onAction', () => {
    it('should dispatch actions to handlers', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      const handler = vi.fn();
      bridge.onAction('ADD_ITEM', handler);

      const payload = { id: '1', quantity: 2 };
      bridge.dispatch('ADD_ITEM', payload);

      expect(handler).toHaveBeenCalledWith(payload);
    });

    it('should support multiple action handlers', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      const handler1 = vi.fn();
      const handler2 = vi.fn();
      bridge.onAction('TEST', handler1);
      bridge.onAction('TEST', handler2);

      bridge.dispatch('TEST', 'data');

      expect(handler1).toHaveBeenCalledWith('data');
      expect(handler2).toHaveBeenCalledWith('data');
    });

    it('should return unsubscribe function for action handlers', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      const handler = vi.fn();
      const unsubscribe = bridge.onAction('TEST', handler);

      bridge.dispatch('TEST', 'first');
      expect(handler).toHaveBeenCalledTimes(1);

      unsubscribe();
      bridge.dispatch('TEST', 'second');
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy', () => {
    it('should cleanup all listeners', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      const stateListener = vi.fn();
      const keyListener = vi.fn();
      const actionHandler = vi.fn();

      bridge.subscribe(stateListener);
      bridge.subscribeKey('total', keyListener);
      bridge.onAction('TEST', actionHandler);

      bridge.destroy();

      expect(() => bridge.getState()).toThrow(/destroyed/);
      expect(() => bridge.setState({ total: 100 })).toThrow(/destroyed/);
    });

    it('should throw when using destroyed bridge', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      bridge.destroy();

      expect(() => bridge.getState()).toThrow();
      expect(() => bridge.setState({})).toThrow();
      expect(() => bridge.subscribe(() => {})).toThrow();
      expect(() => bridge.subscribeKey('total', () => {})).toThrow();
      expect(() => bridge.dispatch('TEST')).toThrow();
      expect(() => bridge.onAction('TEST', () => {})).toThrow();
      expect(() => bridge.destroy()).toThrow();
    });
  });

  describe('error handling', () => {
    it('should catch and log errors in state listeners', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      const errorListener = vi.fn(() => {
        throw new Error('Listener error');
      });
      const normalListener = vi.fn();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      bridge.subscribe(errorListener);
      bridge.subscribe(normalListener);
      bridge.setState({ total: 50 });

      expect(errorListener).toHaveBeenCalled();
      expect(normalListener).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should catch and log errors in action handlers', () => {
      const bridge = createBridge({
        namespace: 'cart',
        schema: CartSchema,
        initialState: { items: [], total: 0 },
      });

      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const normalHandler = vi.fn();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      bridge.onAction('TEST', errorHandler);
      bridge.onAction('TEST', normalHandler);
      bridge.dispatch('TEST', 'data');

      expect(errorHandler).toHaveBeenCalled();
      expect(normalHandler).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
