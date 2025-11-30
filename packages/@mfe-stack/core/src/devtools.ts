/**
 * DevTools hook for browser extension integration.
 * Provides a global hook that the MFE Stack DevTools extension can use
 * to monitor bridges, state changes, and events.
 */

/**
 * Bridge info exposed to devtools
 */
export interface DevtoolsBridgeInfo {
  namespace: string;
  state: unknown;
  actionCount: number;
}

/**
 * Event log entry for devtools
 */
export interface DevtoolsEventLogEntry {
  id: number;
  timestamp: number;
  type: 'state-change' | 'action' | 'event';
  namespace?: string;
  action?: string;
  event?: string;
  payload?: unknown;
  prevState?: unknown;
  newState?: unknown;
}

/**
 * Remote module info for devtools
 */
export interface DevtoolsRemoteInfo {
  name: string;
  url: string;
  loaded: boolean;
}

/**
 * Internal bridge registration
 */
interface RegisteredBridge {
  namespace: string;
  getState: () => unknown;
  actionCount: number;
}

/**
 * MFE Stack hook interface exposed on window
 */
export interface MfeStackHook {
  getBridges(): DevtoolsBridgeInfo[];
  subscribe(callback: (bridges: DevtoolsBridgeInfo[]) => void): () => void;
  subscribeEvents(callback: (event: DevtoolsEventLogEntry) => void): () => void;
  getRemotes(): DevtoolsRemoteInfo[];
  registerRemote(remote: DevtoolsRemoteInfo): void;
  _internal: {
    registerBridge(bridge: RegisteredBridge): () => void;
    notifyStateChange(namespace: string, newState: unknown, prevState: unknown): void;
    notifyAction(namespace: string, action: string, payload: unknown): void;
    notifyEvent(event: string, payload: unknown): void;
    incrementActionCount(namespace: string): void;
  };
}

declare global {
  interface Window {
    __MFE_STACK__?: MfeStackHook;
  }
}

let eventIdCounter = 0;
const registeredBridges = new Map<string, RegisteredBridge>();
const bridgeSubscribers = new Set<(bridges: DevtoolsBridgeInfo[]) => void>();
const eventSubscribers = new Set<(event: DevtoolsEventLogEntry) => void>();
const registeredRemotes = new Map<string, DevtoolsRemoteInfo>();

let isDevtoolsEnabled = false;

/**
 * Get bridge info for all registered bridges.
 */
function getBridges(): DevtoolsBridgeInfo[] {
  return Array.from(registeredBridges.values()).map((bridge) => ({
    namespace: bridge.namespace,
    state: bridge.getState(),
    actionCount: bridge.actionCount,
  }));
}

/**
 * Subscribe to bridge updates.
 */
function subscribe(callback: (bridges: DevtoolsBridgeInfo[]) => void): () => void {
  bridgeSubscribers.add(callback);
  return () => {
    bridgeSubscribers.delete(callback);
  };
}

/**
 * Subscribe to events.
 */
function subscribeEvents(callback: (event: DevtoolsEventLogEntry) => void): () => void {
  eventSubscribers.add(callback);
  return () => {
    eventSubscribers.delete(callback);
  };
}

/**
 * Get all registered remotes.
 */
function getRemotes(): DevtoolsRemoteInfo[] {
  return Array.from(registeredRemotes.values());
}

/**
 * Register a remote module.
 */
function registerRemote(remote: DevtoolsRemoteInfo): void {
  registeredRemotes.set(remote.name, remote);
}

/**
 * Notify all bridge subscribers of changes.
 */
function notifyBridgeSubscribers(): void {
  const bridges = getBridges();
  for (const subscriber of bridgeSubscribers) {
    try {
      subscriber(bridges);
    } catch (error) {
      console.error('[MFE Stack DevTools] Error in bridge subscriber:', error);
    }
  }
}

/**
 * Notify all event subscribers of a new event.
 */
function notifyEventSubscribers(event: DevtoolsEventLogEntry): void {
  for (const subscriber of eventSubscribers) {
    try {
      subscriber(event);
    } catch (error) {
      console.error('[MFE Stack DevTools] Error in event subscriber:', error);
    }
  }
}

/**
 * Register a bridge with devtools.
 */
function registerBridge(bridge: RegisteredBridge): () => void {
  registeredBridges.set(bridge.namespace, bridge);
  notifyBridgeSubscribers();

  return () => {
    registeredBridges.delete(bridge.namespace);
    notifyBridgeSubscribers();
  };
}

/**
 * Notify devtools of a state change.
 */
function notifyStateChange(namespace: string, newState: unknown, prevState: unknown): void {
  const event: DevtoolsEventLogEntry = {
    id: ++eventIdCounter,
    timestamp: Date.now(),
    type: 'state-change',
    namespace,
    newState,
    prevState,
  };
  notifyEventSubscribers(event);
  notifyBridgeSubscribers();
}

/**
 * Notify devtools of an action.
 */
function notifyAction(namespace: string, action: string, payload: unknown): void {
  const event: DevtoolsEventLogEntry = {
    id: ++eventIdCounter,
    timestamp: Date.now(),
    type: 'action',
    namespace,
    action,
    payload,
  };
  notifyEventSubscribers(event);
}

/**
 * Notify devtools of an event bus event.
 */
function notifyEvent(eventName: string, payload: unknown): void {
  const event: DevtoolsEventLogEntry = {
    id: ++eventIdCounter,
    timestamp: Date.now(),
    type: 'event',
    event: eventName,
    payload,
  };
  notifyEventSubscribers(event);
}

/**
 * Increment action count for a bridge.
 */
function incrementActionCount(namespace: string): void {
  const bridge = registeredBridges.get(namespace);
  if (bridge) {
    bridge.actionCount++;
  }
}

/**
 * Create the MFE Stack hook object.
 */
function createHook(): MfeStackHook {
  return {
    getBridges,
    subscribe,
    subscribeEvents,
    getRemotes,
    registerRemote,
    _internal: {
      registerBridge,
      notifyStateChange,
      notifyAction,
      notifyEvent,
      incrementActionCount,
    },
  };
}

/**
 * Enable devtools integration.
 * Call this before creating any bridges to enable debugging.
 *
 * @example
 * ```typescript
 * import { enableDevtools, createBridge } from '@mfe-stack/core';
 *
 * // Enable devtools first
 * enableDevtools();
 *
 * // Then create bridges
 * const myBridge = createBridge({ ... });
 * ```
 */
export function enableDevtools(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (isDevtoolsEnabled) {
    return;
  }

  isDevtoolsEnabled = true;
  window.__MFE_STACK__ = createHook();
}

/**
 * Check if devtools are enabled.
 */
export function isDevtoolsActive(): boolean {
  return isDevtoolsEnabled && typeof window !== 'undefined' && !!window.__MFE_STACK__;
}

/**
 * Get the devtools hook if available.
 */
export function getDevtoolsHook(): MfeStackHook | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return window.__MFE_STACK__;
}
