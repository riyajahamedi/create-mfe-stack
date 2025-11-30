import { describe, it, expect, vi } from 'vitest';
import { createEventBus } from '../event-bus.js';

describe('createEventBus', () => {
  it('should create an event bus', () => {
    const bus = createEventBus();
    expect(bus).toBeDefined();
    expect(bus.emit).toBeDefined();
    expect(bus.on).toBeDefined();
    expect(bus.once).toBeDefined();
    expect(bus.off).toBeDefined();
  });

  describe('emit and on', () => {
    it('should emit events to subscribers', () => {
      const bus = createEventBus();
      const handler = vi.fn();

      bus.on('test', handler);
      bus.emit('test', { value: 42 });

      expect(handler).toHaveBeenCalledWith({ value: 42 });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should support multiple handlers for same event', () => {
      const bus = createEventBus();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bus.on('test', handler1);
      bus.on('test', handler2);
      bus.emit('test', 'hello');

      expect(handler1).toHaveBeenCalledWith('hello');
      expect(handler2).toHaveBeenCalledWith('hello');
    });

    it('should emit undefined when no payload provided', () => {
      const bus = createEventBus();
      const handler = vi.fn();

      bus.on('test', handler);
      bus.emit('test');

      expect(handler).toHaveBeenCalledWith(undefined);
    });

    it('should not call handlers for different events', () => {
      const bus = createEventBus();
      const handler = vi.fn();

      bus.on('event1', handler);
      bus.emit('event2', 'data');

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('should return an unsubscribe function', () => {
      const bus = createEventBus();
      const handler = vi.fn();

      const unsubscribe = bus.on('test', handler);
      expect(typeof unsubscribe).toBe('function');

      bus.emit('test', 'first');
      expect(handler).toHaveBeenCalledTimes(1);

      unsubscribe();
      bus.emit('test', 'second');
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('once', () => {
    it('should only call handler once', () => {
      const bus = createEventBus();
      const handler = vi.fn();

      bus.once('test', handler);
      bus.emit('test', 'first');
      bus.emit('test', 'second');
      bus.emit('test', 'third');

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith('first');
    });

    it('should return an unsubscribe function that prevents the handler', () => {
      const bus = createEventBus();
      const handler = vi.fn();

      const unsubscribe = bus.once('test', handler);
      unsubscribe();
      bus.emit('test', 'data');

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('should remove a specific handler', () => {
      const bus = createEventBus();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bus.on('test', handler1);
      bus.on('test', handler2);
      bus.off('test', handler1);
      bus.emit('test', 'data');

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledWith('data');
    });

    it('should remove all handlers when no handler specified', () => {
      const bus = createEventBus();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bus.on('test', handler1);
      bus.on('test', handler2);
      bus.off('test');
      bus.emit('test', 'data');

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should catch and log errors in handlers without breaking other handlers', () => {
      const bus = createEventBus();
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const normalHandler = vi.fn();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      bus.on('test', errorHandler);
      bus.on('test', normalHandler);
      bus.emit('test', 'data');

      expect(errorHandler).toHaveBeenCalled();
      expect(normalHandler).toHaveBeenCalledWith('data');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
