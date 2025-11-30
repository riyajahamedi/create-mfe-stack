/**
 * Lightweight event bus for one-off events between micro-frontends.
 */

export interface EventBus {
  /**
   * Emit an event with an optional payload.
   */
  emit<T = unknown>(event: string, payload?: T): void;

  /**
   * Subscribe to an event. Returns an unsubscribe function.
   */
  on<T = unknown>(event: string, handler: (payload: T) => void): () => void;

  /**
   * Subscribe to an event for a single invocation. Returns an unsubscribe function.
   */
  once<T = unknown>(event: string, handler: (payload: T) => void): () => void;

  /**
   * Remove a specific handler or all handlers for an event.
   */
  off(event: string, handler?: Function): void;
}

/**
 * Create a new event bus instance for cross-MFE communication.
 *
 * @example
 * ```typescript
 * const bus = createEventBus();
 *
 * // Subscribe to an event
 * const unsubscribe = bus.on('user:login', (user) => {
 *   console.log('User logged in:', user);
 * });
 *
 * // Emit an event
 * bus.emit('user:login', { id: '123', name: 'John' });
 *
 * // Cleanup
 * unsubscribe();
 * ```
 */
export function createEventBus(): EventBus {
  const handlers = new Map<string, Set<Function>>();

  function getHandlers(event: string): Set<Function> {
    let eventHandlers = handlers.get(event);
    if (!eventHandlers) {
      eventHandlers = new Set();
      handlers.set(event, eventHandlers);
    }
    return eventHandlers;
  }

  function emit<T = unknown>(event: string, payload?: T): void {
    const eventHandlers = handlers.get(event);
    if (eventHandlers) {
      for (const handler of eventHandlers) {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      }
    }
  }

  function on<T = unknown>(event: string, handler: (payload: T) => void): () => void {
    const eventHandlers = getHandlers(event);
    eventHandlers.add(handler);

    return () => {
      eventHandlers.delete(handler);
      if (eventHandlers.size === 0) {
        handlers.delete(event);
      }
    };
  }

  function once<T = unknown>(event: string, handler: (payload: T) => void): () => void {
    const wrappedHandler = (payload: T) => {
      off(event, wrappedHandler);
      handler(payload);
    };

    return on(event, wrappedHandler);
  }

  function off(event: string, handler?: Function): void {
    if (!handler) {
      handlers.delete(event);
      return;
    }

    const eventHandlers = handlers.get(event);
    if (eventHandlers) {
      eventHandlers.delete(handler);
      if (eventHandlers.size === 0) {
        handlers.delete(event);
      }
    }
  }

  return {
    emit,
    on,
    once,
    off,
  };
}
