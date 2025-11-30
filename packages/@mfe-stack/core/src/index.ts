/**
 * @mfe-stack/core
 *
 * Type-safe state bridge for micro-frontend communication.
 * This package provides utilities for managing state sharing,
 * event communication, and data synchronization between micro-frontends.
 *
 * @packageDocumentation
 */

export { createBridge, type Bridge, type BridgeConfig } from './bridge.js';
export { createStore, type Store, type StoreConfig } from './store.js';
export { createEventBus, type EventBus } from './event-bus.js';

export const version = '0.1.0';
